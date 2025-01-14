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
): Promise<{ message: string; status: number }> => {
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

export const createNewCollectionRequest = async ({
  collectionName,
  userID,
  collectionDescription,
}: {
  collectionName: string;
  userID: string;
  collectionDescription?: string;
}): Promise<{ message: string; status: number }> => {
  try {
    const response = await fetch('/api/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestType: 'createNewCollection',
        userID,
        collectionName,
        collectionDescription,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create new collection');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating new collection:', error);
  }
  return { message: 'Error', status: 400 };
};

export const updateCollectionRequest = async ({
  collectionID,
  collectionName,
  collectionDescription,
}: {
  collectionID: string;
  collectionName: string;
  collectionDescription: string;
}): Promise<{ message: string; status: number }> => {
  try {
    const response = await fetch('/api/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestType: 'updateCollection',
        collectionID,
        collectionName,
        collectionDescription,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update collection');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating collection:', error);
  }
  return { message: 'Error', status: 400 };
};
