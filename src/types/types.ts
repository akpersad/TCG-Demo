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
  ids?: string[];
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

export type Collection = {
  _id: string;
  userID: string;
  name: string;
  description: string;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CollectionItem = {
  _id: string;
  collectionID: string;
  cardID: string;
  cardName: string;
  cardType: string[];
  setId: string;
  setName: string;
  createdAt: string;
  updatedAt: string;
};

export type inputProps = {
  name: string;
  checked: boolean;
  id?: string;
};
