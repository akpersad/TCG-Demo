'use client';
import { Collection } from '@/types/types';
import { useState } from 'react';
import PokeNameSearch from '@/components/PokeNameSearch/PokeNameSearch';

type Props = {
  userID?: string;
  collections?: Collection[];
};

const AdvancedSearchContainer = ({ userID, collections }: Props) => {
  console.log('🚀 ~ Page ~ user:', userID);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

        <div className='item relative z-0 w-full my-5 pt-4 group'>
          <PokeNameSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <div className='item relative z-0 w-full my-5 pt-5 group'>
          Supertype
        </div>
        <div className='item relative z-0 w-full my-5 pt-5 group'>Subtype</div>
        <div className='item relative z-0 w-full my-5 pt-5 group'>Type</div>
        <div className='item relative z-0 w-full my-5 pt-5 group'>HP Range</div>
        <div className='item relative z-0 w-full my-5 pt-5 group'>
          Weaknesses
        </div>
        <div className='item relative z-0 w-full my-5 pt-5 group'>
          Resistances
        </div>
        <div className='item relative z-0 w-full my-5 pt-5 group'>Set Name</div>
        <div className='item relative z-0 w-full my-5 pt-5 group'>
          Series Name
        </div>
        <div className='item relative z-0 w-full my-5 pt-5 group'>Artist</div>
        <div className='item relative z-0 w-full my-5 pt-5 group'>Rarity</div>
      </div>
    </div>
  );
};

export default AdvancedSearchContainer;
