'use client';

import { SignUpResource } from '@clerk/types';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

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

export const cardItemCollectionRequest = async (
  requestType: string,
  cardData: PokemonTCG.Card,
  collectionID: string
) => {
  try {
    const response = await fetch('/api/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestType,
        cardData,
        collectionID,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to insert card into collection');
    }

    return await response.json();
  } catch (error) {
    console.error('Error inserting card into collection:', error);
  }
  return { message: 'Error', status: 400 };
};
