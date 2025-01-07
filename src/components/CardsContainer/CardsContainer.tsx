'use client';
import Sidebar from '@/components/Sidebar/Sidebar';
import DisplayCards from '@/components/DisplayCards/DisplayCards';
import { useState } from 'react';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { getCardsByName } from '@/app/utils/tcgClient';

type Props = {
  initialCards: PokemonTCG.Card[];
};

const CardsContainer = ({ initialCards }: Props) => {
  const [displayCards, setDisplayCards] =
    useState<PokemonTCG.Card[]>(initialCards);

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

export default CardsContainer;
