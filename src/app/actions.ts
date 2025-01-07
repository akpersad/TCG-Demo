'use server';
import { getCardsByName } from '@/app/utils/tcgClient';

export const getInitialCards = async () => {
  const cards = await getCardsByName({ pokemonName: 'charizard' });
  return cards;
};
