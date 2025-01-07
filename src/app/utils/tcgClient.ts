import { GetCardsProps } from '@/types/types';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

const queryBuilder = (queries: string[]): string => {
  const combiner = queries.filter((item) => item).length > 1 ? ' AND ' : ' ';
  return queries.join(combiner);
};

export const getCardsByName = async ({
  pokemonName,
  searchEnergy,
}: GetCardsProps) => {
  const cardStr = pokemonName.length > 0 ? `name:${pokemonName}` : '';
  const queryArray = [cardStr];

  if (searchEnergy?.some((energy) => energy.checked)) {
    const energyStr = searchEnergy
      .filter((energy) => energy.checked)
      .map((energy) => `types:${energy.name}`)
      .join(' OR ');
    queryArray.push(`(${energyStr})`);
  }

  const cards = await PokemonTCG.findCardsByQueries({
    q: queryBuilder(queryArray),
    orderBy: '-set.releaseDate',
  });
  return cards.slice(0, 10);
};
