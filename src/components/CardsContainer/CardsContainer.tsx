'use client';
import Sidebar from '@/components/Sidebar/Sidebar';
import DisplayCards from '@/components/DisplayCards/DisplayCards';
import { useEffect, useState } from 'react';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { getCardsByName } from '@/app/utils/tcgClient';
import { GetCardsProps } from '@/types/types';

type Props = {
  initialCards: PokemonTCG.Card[];
};

const CardsContainer = ({ initialCards }: Props) => {
  const [displayCards, setDisplayCards] =
    useState<PokemonTCG.Card[]>(initialCards);
  const [cachedSearchParams, setCachedSearchParams] = useState<GetCardsProps>({
    pokemonName: 'charizard',
  });
  const [selectedPageSize, setSelectedPageSize] = useState<number>(12);

  const showCards = async ({
    pokemonName,
    searchEnergy,
    searchSubtypes,
    pageSize,
  }: GetCardsProps) => {
    const sanitizedPageSize = pageSize || selectedPageSize;

    setCachedSearchParams({
      pokemonName,
      searchEnergy,
      searchSubtypes,
      pageSize: sanitizedPageSize,
    });
    const cards = await getCardsByName({
      pokemonName,
      searchEnergy,
      searchSubtypes,
      pageSize: sanitizedPageSize,
    });
    setDisplayCards(cards);
  };

  useEffect(() => {
    showCards({ ...cachedSearchParams, ...{ pageSize: selectedPageSize } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPageSize]);

  const tempFunction = async () => {
    const params = {
      q: 'name:charizard',
      pageSize: '12',
      orderBy: '-set.releaseDate',
    };
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `https://api.pokemontcg.io/v2/cards?${queryString}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': '9e20c5b5-bcf6-4e04-9636-676c3e8250c7',
        },
      }
    );
    const json = await response.json();
    console.log('🚀 ~ tempFunction ~ response:', json);
    // ...handle response...
  };

  useEffect(() => {
    tempFunction();
  }, []);

  return (
    <div className='container mx-auto my-8'>
      <Sidebar showCards={showCards} searchLoading={false} />
      <div className='p-4 sm:ml-64'>
        {/* Put page size dropdown code heree */}

        <div className='mb-4 text-right'>
          <label htmlFor='pageSize' className='mr-2'>
            Result Count:
          </label>
          <select
            id='pageSize'
            value={selectedPageSize}
            onChange={(e) => setSelectedPageSize(Number(e.target.value))}
            className='border rounded p-2 bg-black'
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={36}>36</option>
          </select>
        </div>

        <DisplayCards displayCards={displayCards} />
      </div>
    </div>
  );
};

export default CardsContainer;
