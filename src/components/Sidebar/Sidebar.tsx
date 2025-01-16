'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import styles from './styles.module.scss';
import EnergyCheckboxes from '@/components/EnergyCheckboxes/EnergyCheckboxes';
import { energyJSON } from '@/constants/energy';
import { GetCardsProps } from '@/types/types';
import SubtypesCheckboxes from '@/components/SubtypesCheckboxes/SubtypesCheckboxes';
import { subtypes as SUBTYPES_JSON } from '@/constants/subtypes';
import { convertBoolObjToParams } from '@/app/utils/app';
import { Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import PokeNameSearch from '../PokeNameSearch/PokeNameSearch';

interface GetCardsPropsWithReset extends GetCardsProps {
  resetPageCount?: boolean;
}

type Props = {
  showCards: ({
    pokemonName,
    searchEnergy,
    searchSubtypes,
    resetPageCount,
    supertype,
  }: GetCardsPropsWithReset) => Promise<void>;
  searchLoading: boolean;
  paramEnergy?: string | null;
  paramSubType?: string | null;
  paramName: string;
  paramSupertype?: Supertype[];
};

const energyBase = (param?: string | null) => {
  const sanitizedParam = param ? param.split(',') : [''];
  return energyJSON.map((item) => ({
    name: item.name,
    checked: sanitizedParam.includes(item.name),
  }));
};

const subTypesWithParams = (param?: string | null) => {
  const sanitizedParam = param ? param.split(',') : [''];
  return SUBTYPES_JSON.map((item) => ({
    name: item.name,
    checked: sanitizedParam.includes(item.name),
  }));
};

const Sidebar = ({
  showCards,
  searchLoading,
  paramEnergy,
  paramSubType,
  paramName,
  paramSupertype,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState(paramName);
  const [searchEnergy, setSearchEnergy] = useState(energyBase(paramEnergy));
  const [searchSubtypes, setSearchSubtypes] = useState(
    subTypesWithParams(paramSubType)
  );
  const [supertype, setSupertype] = useState<Supertype[]>(paramSupertype || []);

  const handleCheck = (
    jsonOBJ: {
      name: string;
      checked: boolean;
    }[],
    objSetter: Dispatch<
      SetStateAction<
        {
          name: string;
          checked: boolean;
        }[]
      >
    >,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const foundIndex = jsonOBJ.findIndex(
      (item) => item.name === e.target.value
    );
    const updatedOBJ = [...jsonOBJ];
    updatedOBJ[foundIndex].checked = e.target.checked;
    objSetter(updatedOBJ);
  };

  return (
    <aside
      id='default-sidebar'
      className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 mt-64px ${styles.sidebar}`}
      aria-label='Sidebar'
    >
      <div className='h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800'>
        <ul className='space-y-2 font-medium'>
          <li>
            <div className='relative z-0 w-full mb-5 group'>
              <PokeNameSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
          </li>
          <li>
            <label
              htmlFor='supertype_multiple'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Select card types
            </label>
            <select
              multiple
              id='supertype_multiple'
              size={3}
              value={supertype}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              onChange={(e) => {
                const options = e.target.selectedOptions;
                setSupertype(
                  Array.from(options).map((option) => option.value as Supertype)
                );
              }}
            >
              <option value='Pokemon'>Pokémon</option>
              <option value='Trainer'>Trainer</option>
              <option value='Energy'>Energy</option>
            </select>
          </li>
        </ul>
        <ul className='pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700'>
          <h2 className='mb-4'>Energy Type</h2>
          <li>
            <EnergyCheckboxes
              energies={searchEnergy}
              setEnergies={setSearchEnergy}
              handleCheck={handleCheck}
            />
          </li>
        </ul>
        <ul className='pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700'>
          <h2 className='mb-4'>Sub Type</h2>
          <li>
            <SubtypesCheckboxes
              searchSubtypes={searchSubtypes}
              setSearchSubtypes={setSearchSubtypes}
              handleCheck={handleCheck}
            />
          </li>
        </ul>
        <ul className='pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700'>
          <li>
            <button
              className='w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'
              onClick={() =>
                showCards({
                  pokemonName: searchTerm,
                  searchEnergy: convertBoolObjToParams(searchEnergy),
                  searchSubtypes: convertBoolObjToParams(searchSubtypes),
                  supertype,
                  resetPageCount: true,
                })
              }
              disabled={searchLoading}
            >
              Search
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
