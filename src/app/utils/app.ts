import { GetCardsProps } from '@/types/types';

type Props = {
  name: string;
  checked: boolean;
};

export const convertBoolObjToParams = (boolObj: Props[]) => {
  const names = boolObj.filter((item) => item.checked).map((item) => item.name);
  return names.length > 0 ? names : undefined;
};

export const isEmptyObject = (obj: object) => {
  return Object.keys(obj).length === 0;
};

export const filterParams = (params: {
  [key: string]: string | string[] | undefined;
}) => {
  const filtered = {} as GetCardsProps;

  Object.keys(params).forEach((key) => {
    switch (key) {
      case 'pokemonName':
        filtered.pokemonName = params.pokemonName as string;
        break;
      case 'searchEnergy':
        filtered.searchEnergy = (params.searchEnergy! as string).split(',');
        break;
      case 'searchSubtypes':
        filtered.searchSubtypes = (params.searchSubtypes! as string).split(',');
        break;
      case 'orderBy':
        filtered.orderBy = params.orderBy! as string;
        break;
      case 'pageSize':
        filtered.pageSize = parseInt(params.pageSize! as string, 10);
        break;
      case 'page':
        filtered.page = parseInt(params.page! as string, 10);
        break;
      case 'artist':
        filtered.artist = params.artist! as string;
        break;
      default:
        break;
    }
  });

  return filtered;
};
