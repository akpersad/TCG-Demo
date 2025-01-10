'use client';
import Sidebar from '@/components/Sidebar/Sidebar';
import DisplayCards from '@/components/DisplayCards/DisplayCards';
import Pagination from '@/components/Pagination/Pagination';
import { useState } from 'react';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { getCardsByName } from '@/app/utils/tcgClient';
import { CardsResponseProps, GetCardsProps } from '@/types/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { filterParams } from '@/app/utils/app';
import { useUser } from '@clerk/nextjs';

const CardsContainer = ({ cards, totalCount, page }: CardsResponseProps) => {
  const { isSignedIn } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [displayCards, setDisplayCards] = useState<PokemonTCG.Card[]>(cards);
  const [selectedPageSize, setSelectedPageSize] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [totalCardCount, setTotalCardCount] = useState<number>(totalCount);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterValidParams = (params: Record<string, any>) => {
    return Object.fromEntries(
      Object.entries(params).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value !== undefined && value !== null && value !== ''
      )
    );
  };

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

    const queryParams = filterValidParams({
      pokemonName,
      searchEnergy,
      searchSubtypes,
      pageSize: sanitizedPageSize,
      page: sanitizedPage,
    });
    const updatedParams = new URLSearchParams(queryParams).toString();
    router.push(`/search/cards?${updatedParams}`);

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

  const getCurrentParams = () => {
    const paramObj = Object.fromEntries(searchParams.entries());
    return filterParams(paramObj);
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await showCards({ ...getCurrentParams(), ...{ page } });
  };

  const handlePageSizeChange = async (pageSize: number) => {
    setSelectedPageSize(pageSize);
    await showCards({ ...getCurrentParams(), ...{ pageSize } });
  };

  return (
    <div className='container mx-auto my-8'>
      <Sidebar
        showCards={showCards}
        searchLoading={false}
        paramName={searchParams.get('pokemonName') || ''}
        paramEnergy={searchParams.get('searchEnergy')}
        paramSubType={searchParams.get('searchSubtypes')}
      />
      <div className='p-4 sm:ml-64'>
        {/* Put page size dropdown code heree */}

        <div className='mb-4 text-right'>
          <label htmlFor='pageSize' className='mr-2'>
            Result Count:
          </label>
          <select
            id='pageSize'
            value={selectedPageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className='border rounded p-2 bg-black'
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={36}>36</option>
          </select>
        </div>

        <DisplayCards displayCards={displayCards} isSignedIn={isSignedIn} />
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
