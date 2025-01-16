'use client';
import { Collection } from '@/types/types';
import { Dispatch, SetStateAction, useState } from 'react';
import { Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { subtypes as SUBTYPES_JSON } from '@/constants/subtypes';
import PokeNameSearch from '@/components/PokeNameSearch/PokeNameSearch';
import MultiselectInput from '@/components/MultiselectInput/MultiselectInput';
import EnergyCheckboxes from '@/components/EnergyCheckboxes/EnergyCheckboxes';
import { energyJSON } from '@/constants/energy';
import { StaticImageData } from 'next/image';

type Props = {
  userID?: string;
  collections?: Collection[];
  setNames: {
    name: string;
    id: string;
    checked: boolean;
  }[];
  seriesNames: {
    name: string;
    checked: boolean;
  }[];
};

const convertEnergyObject = (
  energies: { name: string; image: StaticImageData }[]
) => {
  return energies.map((item) => ({
    name: item.name,
    checked: false,
  }));
};

const AdvancedSearchContainer = ({
  userID,
  collections,
  setNames,
  seriesNames,
}: Props) => {
  console.log('🚀 ~ Page ~ user:', userID);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [supertype, setSupertype] = useState<Supertype[]>([]);
  const [subtypesForSearch, setSubtypesForSearch] = useState(SUBTYPES_JSON);
  const [searchSubtypes, setSearchSubtypes] = useState<string[]>([]);
  const [types, setTypes] = useState(convertEnergyObject(energyJSON));
  const [weaknesses, setWeaknesses] = useState(convertEnergyObject(energyJSON));
  const [resistances, setResistances] = useState(
    convertEnergyObject(energyJSON)
  );
  const [searchSets, setSearchSets] = useState(setNames);
  const [searchSetStrings, setSearchSetStrings] = useState<string[]>([]);
  const [searchSeries, setSearchSeries] = useState(seriesNames);
  const [searchSeriesStrings, setSearchSeriesStrings] = useState<string[]>([]);

  const handleCheckForMultiSelect = (
    searchJSONObj: {
      name: string;
      checked: boolean;
    }[],
    searchJSONSetter: Dispatch<
      SetStateAction<
        {
          name: string;
          checked: boolean;
        }[]
      >
    >,
    stringSetter: Dispatch<SetStateAction<string[]>>,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const options = e.target.selectedOptions;
    const selectedStrings = Array.from(options).map((option) => option.value);

    stringSetter(selectedStrings);
    const updatedOBJ = [...searchJSONObj];

    updatedOBJ.forEach((item) => {
      item.checked = selectedStrings.includes(item.name);
    });

    searchJSONSetter(updatedOBJ);
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

  return (
    <div className='advanced-search-container container mx-auto my-8'>
      {/* <div className='sm:w-2/3 mx-auto divide-y-2 divide-gray-300 mt-12'> */}
      <div className='sm:w-2/3 mx-auto mt-12'>
        {/* Collections */}
        {collections && collections.length > 0 && (
          <div className='item relative z-0 w-full mb-5 group'>
            <label
              htmlFor='sortByFilter'
              className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
            >
              Select Collection
            </label>
            <select
              id='sortByFilter'
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className='border rounded p-2 bg-black'
            >
              <option value=''>{''}</option>
              {collections.map((collection) => (
                <option key={`add-to-${collection._id}`} value={collection._id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Card Name */}
        <div className='item relative z-0 w-full my-5 pt-4 group'>
          <PokeNameSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {/* Supertype */}
        <div className='item relative z-0 w-full my-5 pt-5 group'>
          <label
            htmlFor='supertype_multiple'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            Select Card Types
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
        </div>

        {/* Subtype */}
        <div className='item relative z-0 w-full my-5 pt-5 group'>
          <MultiselectInput
            objectForSearch={subtypesForSearch}
            setObjectForSearch={setSubtypesForSearch}
            searchStrings={searchSubtypes}
            setSearchStrings={setSearchSubtypes}
            handleCheckForMultiSelect={handleCheckForMultiSelect}
            title='Select Subtypes'
          />
        </div>

        {/* Types */}
        <div className='item relative z-0 w-full my-5 pt-5 group'>
          <h3 className='mb-4'>Types</h3>
          <EnergyCheckboxes
            energies={types}
            setEnergies={setTypes}
            handleCheck={handleCheck}
            displayAsRow
            type='type'
          />
        </div>

        {/* Weaknesses */}
        <div className='item relative z-0 w-full my-5 pt-5 group'>
          <h3 className='mb-4'>Weaknessess</h3>
          <EnergyCheckboxes
            energies={weaknesses}
            setEnergies={setWeaknesses}
            handleCheck={handleCheck}
            displayAsRow
            type='weakness'
          />
        </div>

        {/* Resistances */}
        <div className='item relative z-0 w-full my-5 pt-5 group'>
          <h3 className='mb-4'>Resistances</h3>
          <EnergyCheckboxes
            energies={resistances}
            setEnergies={setResistances}
            handleCheck={handleCheck}
            displayAsRow
            type='resistance'
          />
        </div>

        {/* HP Range */}
        <div className='item relative z-0 w-full my-5 pt-5 group'>
          <div className='flex'>
            <div className='relative z-0 w-1/2 mb-5 group'>
              <input
                onChange={(e) => console.log(e.target.value)}
                type='number'
                name='floating_min_hp'
                id='floating_min_hp'
                className='block py-2.5 px-0 w-1/2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                required
              />
              <label
                htmlFor='floating_min_hp'
                className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
              >
                Min HP
              </label>
            </div>
            <div className='relative z-0 w-1/2 mb-5 group'>
              <input
                onChange={(e) => console.log(e.target.value)}
                type='number'
                name='floating_max_hp'
                id='floating_max_hp'
                className='block py-2.5 px-0 w-1/2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                required
              />
              <label
                htmlFor='floating_max_hp'
                className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
              >
                Max HP
              </label>
            </div>
          </div>
        </div>

        {/* Set Name */}
        <div className='item relative z-0 w-full my-5 pt-5 group'>
          <MultiselectInput
            objectForSearch={searchSets}
            // @ts-expect-error Typing issue because of the way the object is structured
            setObjectForSearch={setSearchSets}
            searchStrings={searchSetStrings}
            setSearchStrings={setSearchSetStrings}
            handleCheckForMultiSelect={handleCheckForMultiSelect}
            title='Sets'
            linesToShow={10}
          />
        </div>

        {/* Series Name */}
        <div className='item relative z-0 w-full my-5 pt-5 group'>
          <MultiselectInput
            objectForSearch={searchSeries}
            setObjectForSearch={setSearchSeries}
            searchStrings={searchSeriesStrings}
            setSearchStrings={setSearchSeriesStrings}
            handleCheckForMultiSelect={handleCheckForMultiSelect}
            title='Series'
          />
        </div>

        {/* Artist */}
        <div className='item relative z-0 w-full my-5 pt-5 group'>Artist</div>

        {/* Rarity */}
        <div className='item relative z-0 w-full my-5 pt-5 group'>Rarity</div>
      </div>
    </div>
  );
};

export default AdvancedSearchContainer;
