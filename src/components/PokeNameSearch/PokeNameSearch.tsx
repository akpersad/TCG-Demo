import { getPokeNames } from '@/app/utils/pokeApiClient';
import { PokemonClient } from 'pokenode-ts';
import { useState } from 'react';

type Props = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const PokeNameSearch = ({ searchTerm, setSearchTerm }: Props) => {
  const api = new PokemonClient();
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

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
    <>
      <input
        type='text'
        name='floating_name'
        id='floating_name'
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
        Search Card Name
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
    </>
  );
};

export default PokeNameSearch;
