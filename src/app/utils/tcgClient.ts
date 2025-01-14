import { GetCardsProps, ParamsProps } from '@/types/types';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

const queryBuilder = (queries: string[]): string => {
  const sanitizedQueries = queries.filter((item) => item);
  const combiner =
    sanitizedQueries.filter((item) => item).length > 1 ? ' AND ' : ' ';
  return sanitizedQueries.join(combiner);
};

const idCombinor = (ids: string[]): string => {
  return ids.map((id) => `id:${id}`).join(' OR ');
};

const getCardsByIDs = (ids?: string[]) => {
  if (!ids || ids.length === 0) {
    return '';
  }
  const query = ids.length > 1 ? idCombinor(ids) : `id:${ids[0]}`;
  return query;
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
  supertype,
  orderBy = '-set.releaseDate',
  pageSize = 12,
  page = 1,
  artist,
  setId,
  ids,
}: GetCardsProps) => {
  const multiIds = getCardsByIDs(ids);
  const cardStr =
    pokemonName && pokemonName.length > 0 ? `name:${pokemonName}` : '';
  const artistStr = artist && artist.length > 0 ? `artist:"${artist}"` : '';
  const setIdStr = setId && setId.length > 0 ? `set.id:${setId}` : '';
  const queryArray = [multiIds, cardStr, artistStr, setIdStr];

  if (searchEnergy) {
    const energyStr = searchEnergy
      .map((energy) => `types:${energy}`)
      .join(' OR ');
    queryArray.push(`(${energyStr})`);
  }

  if (searchSubtypes) {
    const subtypeStr = searchSubtypes
      .map((subtype) => `subtypes:${subtype}`)
      .join(' OR ');
    queryArray.push(`(${subtypeStr})`);
  }

  if (supertype && supertype.length > 0) {
    const supertypeStr = supertype
      .map((type) => `supertype:${type}`)
      .join(' OR ');
    queryArray.push(`(${supertypeStr})`);
  }

  const cards = await PokemonTCG.findCardsByQueries({
    q: queryBuilder(queryArray),
    orderBy,
    pageSize,
    page,
  });

  const paginationInfo = await getRequestURLForExtraFields({
    q: queryBuilder(queryArray),
    orderBy,
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

export const getSetsByQuery = async () => {
  const sets = await PokemonTCG.findSetsByQueries({
    q: '',
    orderBy: '-releaseDate',
    pageSize: 12,
    page: 1,
  });
  return sets;
};

export const getAllSets = async () => {
  const sets = await PokemonTCG.getAllSets();
  return sets;
};
