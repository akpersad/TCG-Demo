import { GetCardsProps, inputProps } from '@/types/types';
import { Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';

export const convertBoolObjToParams = (boolObj: inputProps[]) => {
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
      case 'supertype':
        filtered.supertype = (params.supertype! as string).split(
          ','
        ) as Supertype[];
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
      case 'setId':
        filtered.setId = params.setId! as string;
        break;
      case 'setIdArray':
        filtered.setIdArray = (params.setIdArray! as string).split(',');
        break;
      case 'series':
        filtered.series = (params.series! as string).split(',');
        break;
      case 'weaknesses':
        filtered.weaknesses = (params.weaknesses! as string).split(',');
        break;
      case 'resistances':
        filtered.resistances = (params.resistances! as string).split(',');
        break;
      case 'rarities':
        filtered.rarities = (params.rarities! as string).split(',');
        break;
      case 'hpMin':
        filtered.hpMin = parseInt(params.hpMin! as string, 10);
        break;
      case 'hpMax':
        filtered.hpMax = parseInt(params.hpMax! as string, 10);
        break;
      default:
        break;
    }
  });

  return filtered;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filterValidParams = (params: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(params).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, value]) =>
        value !== undefined &&
        value !== null &&
        value !== '' &&
        (Array.isArray(value) ? value.length > 0 : true)
    )
  );
};
