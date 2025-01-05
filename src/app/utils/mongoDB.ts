import { MongoClient } from 'mongodb';
import { SignUpResource } from '@clerk/types';

export const insertUser = async (user: SignUpResource) => {
  const client = new MongoClient(process.env.MONGODB_URI || '');
  let response = { message: 'Uncaught issue', status: 500 };
  try {
    await client.connect();
    const database = client.db('TCG-Demo');
    const collection = database.collection('users');

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

    const result = await collection.insertOne(userWithTimestamps);
    console.log(
      `New user inserted with the following id: ${result.insertedId}`
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
