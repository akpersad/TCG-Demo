'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import styles from './styles.module.scss';
import { PokemonClient } from 'pokenode-ts';
import { getPokeNames } from '@/app/utils/pokeApiClient';
import EnergyCheckboxes from '@/components/EnergyCheckboxes/EnergyCheckboxes';
import { energyJSON } from '@/constants/energy';
import { GetCardsProps } from '@/types/types';
import SubtypesCheckboxes from '@/components/SubtypesCheckboxes/SubtypesCheckboxes';
import { subtypes as SUBTYPES_JSON } from '@/constants/subtypes';

type Props = {
  showCards: ({
    pokemonName,
    searchEnergy,
    searchSubtypes,
    resetPageCount,
  }: GetCardsProps & { resetPageCount?: boolean }) => Promise<void>;
  searchLoading: boolean;
};

const energyBase = () => {
  return energyJSON.map((item) => ({
    name: item.name,
    checked: false,
  }));
};

const Sidebar = ({ showCards, searchLoading }: Props) => {
  const api = new PokemonClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchEnergy, setSearchEnergy] = useState(energyBase());
  const [searchSubtypes, setSearchSubtypes] = useState(SUBTYPES_JSON);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value) {
      getPokeNames(api, value).then((data) => {
        setFilteredData(data.map((item) => item.name));
      });
    } else {
      setFilteredData([]);
    }
  };

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      setActiveIndex((prevIndex) => (prevIndex + 1) % filteredData.length);
    } else if (event.key === 'ArrowUp') {
      setActiveIndex(
        (prevIndex) =>
          (prevIndex - 1 + filteredData.length) % filteredData.length
      );
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      if (filteredData[activeIndex]) {
        handleItemClick(filteredData[activeIndex]);
      }
    }
  };

  const handleItemClick = (item: string) => {
    setSearchTerm(item);
    setFilteredData([]);
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
              <input
                type='text'
                name='floating_name'
                id='floating_name'
                // className='capitalize w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                className='block capitalize py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                value={searchTerm}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
              />
              <label
                htmlFor='floating_name'
                className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
              >
                Search Pokemon Name
              </label>
              {filteredData.length > 0 && (
                <ul className='capitalize absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg text-black'>
                  {filteredData.map((item, index) => (
                    <li
                      key={index}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                        index === activeIndex ? 'bg-gray-200' : ''
                      }`}
                      onClick={() => handleItemClick(item)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
                  searchEnergy,
                  searchSubtypes,
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
