import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

export const getCardsByName = async (pokemonName: string) => {
  const cards = await PokemonTCG.findCardsByQueries({
    q: `name:${pokemonName}`,
    orderBy: '-set.releaseDate',
  });
  return cards.slice(0, 10);
};
