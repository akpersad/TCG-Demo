'use client';
import Sidebar from '@/components/Sidebar/Sidebar';
import DisplayCards from '@/components/DisplayCards/DisplayCards';
import Pagination from '@/components/Pagination/Pagination';
import { useEffect, useState } from 'react';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { getCardsByName } from '@/app/utils/tcgClient';
import { CardsResponseProps, GetCardsProps } from '@/types/types';

const CardsContainer = ({ cards, totalCount, page }: CardsResponseProps) => {
  const [displayCards, setDisplayCards] = useState<PokemonTCG.Card[]>(cards);
  const [cachedSearchParams, setCachedSearchParams] = useState<GetCardsProps>({
    pokemonName: 'charizard',
  });
  const [selectedPageSize, setSelectedPageSize] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [totalCardCount, setTotalCardCount] = useState<number>(totalCount);

  const showCards = async ({
    pokemonName,
    searchEnergy,
    searchSubtypes,
    pageSize,
    page,
    resetPageCount,
  }: GetCardsProps & { resetPageCount?: boolean }) => {
    const sanitizedPageSize = pageSize || selectedPageSize;
    const sanitizedPage = resetPageCount ? 1 : page || currentPage;

    setCachedSearchParams({
      pokemonName,
      searchEnergy,
      searchSubtypes,
      pageSize: sanitizedPageSize,
      page: currentPage,
    });
    const cardsResponse = await getCardsByName({
      pokemonName,
      searchEnergy,
      searchSubtypes,
      pageSize: sanitizedPageSize,
      page: sanitizedPage,
    });
    setDisplayCards(cardsResponse.cards);
    setTotalCardCount(cardsResponse.totalCount);
    setCurrentPage(cardsResponse.page);
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await showCards({ ...cachedSearchParams, ...{ page } });
  };

  useEffect(() => {
    showCards({ ...cachedSearchParams, ...{ pageSize: selectedPageSize } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPageSize]);

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
        {totalCardCount > selectedPageSize && (
          <Pagination
            totalCount={totalCardCount}
            pageSize={selectedPageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default CardsContainer;
