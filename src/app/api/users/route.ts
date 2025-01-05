import { SignUpResource } from '@clerk/types';
import { insertUser } from '@/app/utils/mongoDB';

export async function GET() {
  return new Response('Hello from App Router Users route!', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

export async function POST(request: Request) {
  try {
    const user: SignUpResource = await request.json();
    const returnStatus = await insertUser(user);

    if (returnStatus.status !== 200) {
      throw new Error('Failed to insert user');
    }
  } catch (error) {
    return Response.json({ message: `Webhook error: ${error}`, status: 400 });
  }

  return Response.json({ message: 'success', status: 200 });
}
