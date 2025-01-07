'use client';
import Sidebar from '@/components/Sidebar/Sidebar';
import DisplayCards from '@/components/DisplayCards/DisplayCards';
import Image from 'next/image';
import { getCardsByName } from '@/app/utils/tcgClient';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { useState, useEffect } from 'react';

const CardsPage = () => {
  const [displayCards, setDisplayCards] = useState<PokemonTCG.Card[]>();

  useEffect(() => {
    const fetchInitialCards = async () => {
      const cards = await getCardsByName('oak');
      setDisplayCards(cards);
    };
    fetchInitialCards();
  }, []);

  const showCards = async (item: string) => {
    const cards = await getCardsByName(item);
    setDisplayCards(cards);
  };

  return (
    <div className='container mx-auto my-8'>
      <Sidebar showCards={showCards} searchLoading={false} />
      <div className='p-4 sm:ml-64'>
        <DisplayCards displayCards={displayCards} />
      </div>
    </div>
  );
};

export default CardsPage;
