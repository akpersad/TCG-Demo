'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PokemonClient } from 'pokenode-ts';
import { getPokeNames } from './utils/pokeApiClient';
import { getCardsByName } from './utils/tcgClient';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

export default function Home() {
  const api = new PokemonClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [displayCards, setDisplayCards] = useState<PokemonTCG.Card[]>();
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

  const handleItemClick = (item: string) => {
    setSearchTerm(item);
    setFilteredData([]);
    showCards(item);
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

  const showCards = async (item: string) => {
    const cards = await getCardsByName(item);
    setDisplayCards(cards);
  };

  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center'>
        <Image
          className='dark:invert'
          src='/next.svg'
          alt='Next.js logo'
          width={180}
          height={38}
          priority
        />
        <div className='relative w-full max-w-xs'>
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
        </div>
        <ol className='list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]'>
          <li className='mb-2'>
            Get started by editing{' '}
            <code className='bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold'>
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className='flex flex-row flex-wrap gap-5'>
          {displayCards?.map((card, index) => (
            <div key={index} className='flex flex-col gap-2'>
              <h2 className='capitalize text-lg font-semibold'>{card.name}</h2>
              <Image
                src={card.images.small}
                alt={card.name}
                width={300}
                height={500}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
