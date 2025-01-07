import { GetCardsProps } from '@/types/types';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

const queryBuilder = (queries: string[]): string => {
  const sanitizedQueries = queries.filter((item) => item);
  const combiner =
    sanitizedQueries.filter((item) => item).length > 1 ? ' AND ' : ' ';
  return sanitizedQueries.join(combiner);
};

export const getCardsByName = async ({
  pokemonName,
  searchEnergy,
  searchSubtypes,
  pageSize = 12,
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

  if (searchSubtypes?.some((subtype) => subtype.checked)) {
    const subtypeStr = searchSubtypes
      .filter((subtype) => subtype.checked)
      .map((subtype) => `subtypes:${subtype.name}`)
      .join(' OR ');
    queryArray.push(`(${subtypeStr})`);
  }

  const cards = await PokemonTCG.findCardsByQueries({
    q: queryBuilder(queryArray),
    orderBy: '-set.releaseDate',
    pageSize,
  });
  return cards;
};
