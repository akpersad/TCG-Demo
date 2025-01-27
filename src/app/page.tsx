'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PokemonClient } from 'pokenode-ts';
import { getPokeNames } from './utils/pokeApiClient';
import { getCardsByName } from './utils/tcgClient';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import HomeContainer from '@/components/HomeContainer/HomeContainer';

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
    const { cards } = await getCardsByName({ pokemonName: item });
    setDisplayCards(cards);
  };

  return (
    <div className='max-w-screen-xl mx-auto items-center justify-items-center p-8 font-[family-name:var(--font-geist-sans)]'>
      {/* <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'> */}
      <main className='flex flex-col gap-8 row-start-2 items-center sm:p-1'>
        <HomeContainer />
      </main>
    </div>
  );
}
