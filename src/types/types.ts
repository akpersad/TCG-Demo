import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

export type GetCardsProps = {
  pokemonName: string;
  searchEnergy?: {
    name: string;
    checked: boolean;
  }[];
  searchSubtypes?: {
    name: string;
    checked: boolean;
  }[];
  pageSize?: number;
  page?: number;
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
