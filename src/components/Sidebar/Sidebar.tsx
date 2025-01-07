'use client';
import { useState } from 'react';
import styles from './styles.module.scss';
import { PokemonClient } from 'pokenode-ts';
import { getPokeNames } from '@/app/utils/pokeApiClient';

type Props = {
  showCards: (item: string) => Promise<void>;
  searchLoading: boolean;
};

const Sidebar = ({ showCards, searchLoading }: Props) => {
  const api = new PokemonClient();
  const [searchTerm, setSearchTerm] = useState('');
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
      handleItemClick(filteredData[activeIndex]);
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
            <input
              type='text'
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              className='capitalize w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Search...'
            />
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
          </li>
          <li>
            <button
              className='w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'
              onClick={() => showCards(searchTerm)}
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
