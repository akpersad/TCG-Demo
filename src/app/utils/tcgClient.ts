import { GetCardsProps, GroupedSet, ParamsProps } from '@/types/types';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

const queryBuilder = (queries: string[]): string => {
  const sanitizedQueries = queries.filter((item) => item);
  const combiner =
    sanitizedQueries.filter((item) => item).length > 1 ? ' AND ' : ' ';
  return sanitizedQueries.map((item) => `(${item})`).join(combiner);
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

const fetchCardsAndPagination = async (params: ParamsProps) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`https://api.pokemontcg.io/v2/cards?${queryString}`,
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
    cards: (json.data || []) as PokemonTCG.Card[],
    page: json.page as number,
    pageSize: json.pageSize as number,
    count: json.count as number,
    totalCount: json.totalCount as number,
  };
};

const combineSameParams = ({
  paramName,
  param,
}: {
  paramName: string;
  param?: string[];
}) => {
  if (!param || param.length === 0) {
    return '';
  }
  return param.map((item) => `${paramName}:"${item}"`).join(' OR ');
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
  setIdArray,
  series,
  weaknesses,
  resistances,
  hpMin,
  hpMax,
  rarities,
}: GetCardsProps) => {
  const multiIds = getCardsByIDs(ids);
  const cardStr =
    pokemonName && pokemonName.length > 0 ? `name:${pokemonName}` : '';
  const artistStr = artist && artist.length > 0 ? `artist:"${artist}"` : '';
  const setIdStr = setId && setId.length > 0 ? `set.id:${setId}` : '';
  const energyTypeStr = combineSameParams({
    paramName: 'types',
    param: searchEnergy,
  });
  const subtypesStr = combineSameParams({
    paramName: 'subtypes',
    param: searchSubtypes,
  });
  const supertypeStr = combineSameParams({
    paramName: 'supertype',
    param: supertype,
  });
  const setsIdArrayStr = combineSameParams({
    paramName: 'set.id',
    param: setIdArray,
  });
  const seriesStr = combineSameParams({
    paramName: 'set.series',
    param: series,
  });
  const weaknessesStr = combineSameParams({
    paramName: 'weaknesses.type',
    param: weaknesses,
  });
  const resistancesStr = combineSameParams({
    paramName: 'resistances.type',
    param: resistances,
  });
  const hpStr =
    hpMin || hpMax
      ? `hp:[${hpMin ? hpMin : '*'} TO ${hpMax ? hpMax : '*'}]`
      : '';
  const raritiesStr = combineSameParams({
    paramName: 'rarity',
    param: rarities,
  });

  const queryArray = [
    multiIds,
    cardStr,
    artistStr,
    setIdStr,
    energyTypeStr,
    subtypesStr,
    supertypeStr,
    setsIdArrayStr,
    seriesStr,
    weaknessesStr,
    resistancesStr,
    hpStr,
    raritiesStr,
  ];

  // Single request for both data and pagination
  const { cards, page: pg, pageSize: pz, count, totalCount } = await fetchCardsAndPagination({
    q: queryBuilder(queryArray),
    orderBy,
    pageSize: pageSize.toString(),
    page: page.toString(),
  });
  return { cards, page: pg, pageSize: pz, count, totalCount };
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

export const sortAndGroupSets = (sets: PokemonTCG.Set[]) => {
  const groupedSets: GroupedSet[] = [];
  sets.forEach((set) => {
    const existingGroup = groupedSets.find(
      (group) => group.series === set.series
    );
    if (existingGroup) {
      existingGroup.sets.push(set);
      if (set.releaseDate < existingGroup.earliestReleaseDate) {
        existingGroup.earliestReleaseDate = set.releaseDate;
      }
    } else {
      groupedSets.push({
        series: set.series,
        sets: [set],
        earliestReleaseDate: set.releaseDate,
      });
    }
  });

  groupedSets.forEach((group) => {
    group.sets.sort((a, b) => (a.releaseDate > b.releaseDate ? -1 : 1));
  });

  return groupedSets.sort((a, b) =>
    a.earliestReleaseDate > b.earliestReleaseDate ? -1 : 1
  );
};

export const getSetAndSeriesNames = (sortedSets: GroupedSet[]) => {
  const seriesNames = sortedSets.map((set) => {
    return { name: set.series, checked: false };
  });
  const setNames = sortedSets.flatMap((seriesSet) => {
    return seriesSet.sets.map((set) => {
      return { name: set.name, id: set.id, checked: false };
    });
  });
  return { seriesNames, setNames };
};

export const getAllRarities = async () => {
  const rarities = await PokemonTCG.getRarities();
  return rarities;
};

export const transformRarities = (rarities: PokemonTCG.Rarity[]) => {
  return rarities.map((rarity) => {
    return { name: rarity, checked: false };
  });
};
