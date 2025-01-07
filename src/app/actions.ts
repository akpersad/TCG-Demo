'use server';

import { getCardsByName } from './utils/tcgClient';

export const getInitialCards = async () => {
  const cards = await getCardsByName('charizard');
  return cards;
};
