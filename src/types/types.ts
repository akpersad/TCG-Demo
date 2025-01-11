import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

export type GetCardsProps = {
  pokemonName?: string;
  searchEnergy?: string[];
  searchSubtypes?: string[];
  orderBy?: string;
  pageSize?: number;
  page?: number;
  artist?: string;
  setId?: string;
};

export type ParamsProps = {
  q: string;
  pageSize: string;
  orderBy: string;
  page?: string;
};

export type CardsResponseProps = {
  cards: PokemonTCG.Card[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
};

export type GroupedSet = {
  series: string;
  sets: PokemonTCG.Set[];
  earliestReleaseDate: string;
};
