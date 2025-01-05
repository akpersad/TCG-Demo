'use client';

import { SignUpResource } from '@clerk/types';

export const insertUserFromClient = async (user: SignUpResource) => {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error('Failed to insert user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error inserting user:', error);
  }
  return { message: 'Error', status: 400 };
};
