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
};
