import { MongoClient, ObjectId } from 'mongodb';
import { SignUpResource } from '@clerk/types';
import { Collection, CollectionItem } from '@/types/types';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

export const insertUser = async (user: SignUpResource) => {
  const client = new MongoClient(process.env.MONGODB_URI || '');
  let response = { message: 'Uncaught issue', status: 500 };
  try {
    await client.connect();
    const database = client.db('TCG-Demo');
    const userCollection = database.collection('users');
    const collectionsCollection = database.collection('collections');

    if (!user.createdUserId) {
      throw new Error('User ID is missing');
    }

    const currentDate = new Date();
    const userWithTimestamps = {
      userID: user.createdUserId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    const collectionWithTimestamps = {
      userID: user.createdUserId,
      name:
        process.env.NEXT_PUBLIC_FAVORITE_COLLECTION_NAME || 'My Liked Cards',
      description: '',
      cardCount: 0,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    const result = await userCollection.insertOne(userWithTimestamps);
    console.log(
      `New user inserted with the following id: ${result.insertedId}`
    );
    const collectionResult = await collectionsCollection.insertOne(
      collectionWithTimestamps
    );
    console.log(
      '🚀 ~ insertUser ~ collectionResult:',
      collectionResult.insertedId
    );
    response = { message: 'success', status: 200 };
  } catch (error) {
    console.error(error);
    response = { message: `Webhook error: ${error}`, status: 400 };
  } finally {
    await client.close();
    return response;
  }
};

export const getUserCollections = async (userID: string) => {
  const client = new MongoClient(process.env.MONGODB_URI || '');
  try {
    await client.connect();
    const database = client.db('TCG-Demo');
    const collectionsCollection = database.collection('collections');

    const collections = await collectionsCollection
      .find<Collection>({ userID })
      .toArray();
    collections.forEach((collection) => {
      collection._id = collection._id.toString();
    });
    return collections;
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching collections: ${error}`);
  } finally {
    await client.close();
  }
};

export const getCollectionByUserIDAndName = async (
  userID: string,
  collectionName: string
) => {
  const client = new MongoClient(process.env.MONGODB_URI || '');
  try {
    await client.connect();
    const database = client.db('TCG-Demo');
    const collectionsCollection = database.collection('collections');

    const collection = await collectionsCollection.findOne<Collection>({
      userID,
      name: collectionName,
    });

    if (collection?._id) {
      collection._id = collection._id.toString();
    }
    return collection;
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching collections: ${error}`);
  } finally {
    await client.close();
  }
};

export const insertCardIntoCollection = async ({
  cardData,
  collectionID,
}: {
  cardData: PokemonTCG.Card;
  collectionID: string;
}) => {
  const client = new MongoClient(process.env.MONGODB_URI || '');
  try {
    await client.connect();
    const database = client.db('TCG-Demo');
    const collectionsCollection = database.collection('collection_items');
    const collections = database.collection('collections');

    const currentDate = new Date();
    const collectionItemWithTimestamps = {
      collectionID,
      cardID: cardData.id,
      cardName: cardData.name,
      cardType: cardData.types,
      setId: cardData.set.id,
      setName: cardData.set.name,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    const result = await collectionsCollection.insertOne(
      collectionItemWithTimestamps
    );

    if (result.insertedId) {
    }
    await collections.updateOne(
      { _id: new ObjectId(collectionID) },
      { $inc: { cardCount: 1 } }
    );

    console.log(
      `New user inserted with the following id: ${result.insertedId}`
    );

    return { status: 200, result: result.insertedId, message: 'success' };
  } catch (error) {
    console.error(error);
    throw new Error(`Error inserting collections: ${error}`);
  } finally {
    await client.close();
  }
};

export const removeCardFromCollection = async ({
  cardData,
  collectionID,
}: {
  cardData: PokemonTCG.Card;
  collectionID: string;
}) => {
  const client = new MongoClient(process.env.MONGODB_URI || '');
  try {
    await client.connect();
    const database = client.db('TCG-Demo');
    const collectionsCollection = database.collection('collection_items');
    const collections = database.collection('collections');

    const result = await collectionsCollection.deleteOne({
      cardID: cardData.id,
      collectionID,
    });

    if (result.deletedCount > 0) {
      await collections.updateOne(
        { _id: new ObjectId(collectionID) },
        { $inc: { cardCount: -1 * result.deletedCount } }
      );
    }

    return { status: 200, result, message: 'success' };
  } catch (error) {
    console.error(error);
    throw new Error(`Error inserting collections: ${error}`);
  } finally {
    await client.close();
  }
};

export const getCollectionCardIds = async (collectionId: string) => {
  const client = new MongoClient(process.env.MONGODB_URI || '');
  try {
    await client.connect();
    const database = client.db('TCG-Demo');
    const collectionsCollection = database.collection('collection_items');

    const collectionItems = await collectionsCollection
      .find<CollectionItem>({ collectionID: collectionId })
      .toArray();

    return collectionItems.map((item) => item.cardID);
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching collections: ${error}`);
  } finally {
    await client.close();
  }
};

export const createNewCollection = async ({
  userID,
  collectionName,
  collectionDescription,
}: {
  userID: string;
  collectionName: string;
  collectionDescription: string;
}) => {
  const client = new MongoClient(process.env.MONGODB_URI || '');
  try {
    await client.connect();
    const database = client.db('TCG-Demo');
    const collectionsCollection = database.collection('collections');

    const currentDate = new Date();
    const collectionWithTimestamps = {
      userID,
      name: collectionName,
      description: collectionDescription,
      cardCount: 0,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    const result = await collectionsCollection.insertOne(
      collectionWithTimestamps
    );
    console.log(
      `New collection inserted with the following id: ${result.insertedId}`
    );

    return {
      status: 200,
      result: result.insertedId.toString(),
      message: 'success',
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Error inserting collections: ${error}`);
  } finally {
    await client.close();
  }
};

export const getCollectionAndItems = async (collectionId: string) => {
  const client = new MongoClient(process.env.MONGODB_URI || '');
  try {
    await client.connect();
    const database = client.db('TCG-Demo');
    const collectionsCollection = database.collection('collections');
    const collectionItemsCollection = database.collection('collection_items');

    const collection = await collectionsCollection.findOne<Collection>({
      _id: new ObjectId(collectionId),
    });

    if (collection) {
      collection._id = collection._id.toString();
    }

    const collectionItems = await collectionItemsCollection
      .find<CollectionItem>({ collectionID: collectionId })
      .toArray();

    return { collection, collectionItems, status: 200, message: 'success' };
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching collections: ${error}`);
  } finally {
    await client.close();
  }
};
