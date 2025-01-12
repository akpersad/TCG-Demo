import { MongoClient } from 'mongodb';
import { SignUpResource } from '@clerk/types';
import { Collection } from '@/types/types';

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
      name: 'My Liked Cards',
      description: '',
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
    return collections;
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching collections: ${error}`);
  } finally {
    await client.close();
  }
};
