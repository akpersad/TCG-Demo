import { GetCardsProps, ParamsProps } from '@/types/types';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

const queryBuilder = (queries: string[]): string => {
  const sanitizedQueries = queries.filter((item) => item);
  const combiner =
    sanitizedQueries.filter((item) => item).length > 1 ? ' AND ' : ' ';
  return sanitizedQueries.join(combiner);
};

const getRequestURLForExtraFields = async (params: ParamsProps) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(
    `https://api.pokemontcg.io/v2/cards?${queryString}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.NEXT_PUBLIC_POKEMON_TCG_API_KEY || '',
      },
    }
  );
  const json = await response.json();
  return {
    page: json.page as number,
    pageSize: json.pageSize as number,
    count: json.count as number,
    totalCount: json.totalCount as number,
  };
};

export const getCardsByName = async ({
  pokemonName,
  searchEnergy,
  searchSubtypes,
  pageSize = 12,
  page = 1,
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
    page,
  });

  const paginationInfo = await getRequestURLForExtraFields({
    q: queryBuilder(queryArray),
    orderBy: '-set.releaseDate',
    pageSize: pageSize.toString(),
    page: page.toString(),
  });

  return { cards, ...paginationInfo };
};

export const getCardById = async (id: string) => {
  try {
    const card = await PokemonTCG.findCardByID(id);
    return { status: 200, card };
  } catch (error) {
    // @ts-expect-error error is not typed
    return { status: error?.response.status || 404, card: null };
  }
};
