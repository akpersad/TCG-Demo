import { insertCardIntoCollection, insertUser } from '@/app/utils/mongoDB';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

type RequestProps = {
  requestType: string;
  cardData: PokemonTCG.Card;
  collectionId: string;
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

    const returnStatus =
      parsedRequest.requestType === 'cardToCollection'
        ? await insertCardIntoCollection(
            parsedRequest.cardData,
            parsedRequest.collectionId
          )
        : { status: 400 };

    if (returnStatus.status !== 200) {
      throw new Error('Failed to insert user');
    }
  } catch (error) {
    return Response.json({ message: `Webhook error: ${error}`, status: 400 });
  }

  return Response.json({ message: 'success', status: 200 });
}
