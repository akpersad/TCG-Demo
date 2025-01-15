import {
  insertCardIntoCollection,
  removeCardFromCollection,
  createNewCollection,
  updateCollection,
} from '@/app/utils/mongoDB';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

type RequestProps = {
  requestType?: string;
  cardData?: PokemonTCG.Card;
  collectionID?: string;
  userID?: string;
  collectionName?: string;
  collectionDescription?: string;
};

export async function GET() {
  return new Response('Hello from App Router Collections route!', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

export async function POST(request: Request) {
  try {
    const parsedRequest: RequestProps = await request.json();
    let returnStatus = { status: 300, message: 'Error' };

    if (
      parsedRequest.requestType === 'addCardToCollection' &&
      parsedRequest.cardData &&
      parsedRequest.collectionID
    ) {
      returnStatus = await insertCardIntoCollection({
        cardData: parsedRequest.cardData,
        collectionID: parsedRequest.collectionID,
      });
    }

    if (
      parsedRequest.requestType === 'removeCardFromCollection' &&
      parsedRequest.cardData &&
      parsedRequest.collectionID
    ) {
      returnStatus = await removeCardFromCollection({
        cardData: parsedRequest.cardData,
        collectionID: parsedRequest.collectionID,
      });
    }

    if (
      parsedRequest.requestType === 'createNewCollection' &&
      parsedRequest.userID &&
      parsedRequest.collectionName
    ) {
      returnStatus = await createNewCollection({
        userID: parsedRequest.userID,
        collectionName: parsedRequest.collectionName,
        collectionDescription: parsedRequest.collectionDescription || '',
      });
    }

    if (
      parsedRequest.requestType === 'updateCollection' &&
      parsedRequest.collectionID &&
      parsedRequest.collectionName
    ) {
      returnStatus = await updateCollection({
        collectionID: parsedRequest.collectionID,
        collectionName: parsedRequest.collectionName,
        collectionDescription: parsedRequest.collectionDescription || '',
      });
    }

    if (returnStatus.status !== 200) {
      throw new Error('Failed to insert user');
    }
  } catch (error) {
    return Response.json({ message: `Webhook error: ${error}`, status: 400 });
  }

  return Response.json({ message: 'success', status: 200 });
}
