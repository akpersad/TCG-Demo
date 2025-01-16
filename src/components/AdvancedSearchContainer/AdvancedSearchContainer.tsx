'use client';
import { Collection } from '@/types/types';
import { Dispatch, SetStateAction, useState } from 'react';
import { Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { subtypes as SUBTYPES_JSON } from '@/constants/subtypes';
import PokeNameSearch from '@/components/PokeNameSearch/PokeNameSearch';
import SubtypesMultiselect from '@/components/SubtypesMultiselect/SubtypesMultiselect';

type Props = {
  userID?: string;
  collections?: Collection[];
};

const AdvancedSearchContainer = ({ userID, collections }: Props) => {
  console.log('🚀 ~ Page ~ user:', userID);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [supertype, setSupertype] = useState<Supertype[]>([]);
  const [subtypesForSearch, setSubtypesForSearch] = useState(SUBTYPES_JSON);
  const [searchSubtypes, setSearchSubtypes] = useState<string[]>([]);

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
          <SubtypesMultiselect
            subtypesForSearch={subtypesForSearch}
            setSubtypesForSearch={setSubtypesForSearch}
            searchSubtypes={searchSubtypes}
            setSearchSubtypes={setSearchSubtypes}
            handleCheckForMultiSelect={handleCheckForMultiSelect}
          />
        </div>

        {/* Types */}
        <div className='item relative z-0 w-full my-5 pt-5 group'>Type</div>

        {/* HP Range */}
        <div className='item relative z-0 w-full my-5 pt-5 group'>HP Range</div>

        {/* Weaknesses */}
        <div className='item relative z-0 w-full my-5 pt-5 group'>
          Weaknesses
        </div>

        {/* Resistances */}
        <div className='item relative z-0 w-full my-5 pt-5 group'>
          Resistances
        </div>

        {/* Set Name */}
        <div className='item relative z-0 w-full my-5 pt-5 group'>Set Name</div>

        {/* Series Name */}
        <div className='item relative z-0 w-full my-5 pt-5 group'>
          Series Name
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
