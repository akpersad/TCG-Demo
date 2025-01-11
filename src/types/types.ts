import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';

export type GetCardsProps = {
  pokemonName?: string;
  searchEnergy?: string[];
  searchSubtypes?: string[];
  orderBy?: string;
  pageSize?: number;
  page?: number;
  artist?: string;
  setId?: string;
  supertype?: Supertype[];
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
