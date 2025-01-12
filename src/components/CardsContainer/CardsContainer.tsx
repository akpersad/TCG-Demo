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
import { Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';

const CardsContainer = ({ cards, totalCount, page }: CardsResponseProps) => {
  const { isSignedIn } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [displayCards, setDisplayCards] = useState<PokemonTCG.Card[]>(cards);
  const [selectedPageSize, setSelectedPageSize] = useState<number>(12);
  const [sortByChoice, setSortByChoice] = useState<string>('-set.releaseDate');
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [totalCardCount, setTotalCardCount] = useState<number>(totalCount);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

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
    orderBy,
    pageSize,
    page,
    resetPageCount,
    supertype,
  }: GetCardsProps & { resetPageCount?: boolean }) => {
    setDataLoading(true);
    const sanitizedPageSize = pageSize || selectedPageSize;
    const sanitizedPage = resetPageCount ? 1 : page || currentPage;
    const sanitizedSortBy = orderBy || sortByChoice;

    const queryParams = filterValidParams({
      pokemonName,
      searchEnergy,
      searchSubtypes,
      supertype,
      orderBy: sanitizedSortBy,
      pageSize: sanitizedPageSize,
      page: sanitizedPage,
      artist: searchParams.get('artist'),
      setId: searchParams.get('setId'),
    });
    const updatedParams = new URLSearchParams(queryParams).toString();
    router.push(`/search/cards?${updatedParams}`);

    const cardsResponse = await getCardsByName({
      pokemonName,
      searchEnergy,
      searchSubtypes,
      supertype,
      orderBy: sanitizedSortBy,
      pageSize: sanitizedPageSize,
      page: sanitizedPage,
      artist: searchParams.get('artist') || undefined,
      setId: searchParams.get('setId') || undefined,
    });

    setSortByChoice(sanitizedSortBy);
    setDisplayCards(cardsResponse.cards);
    setTotalCardCount(cardsResponse.totalCount);
    setCurrentPage(cardsResponse.page);
    setDataLoading(false);
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

  const handleSortByChange = async (orderBy: string) => {
    setSortByChoice(orderBy);
    await showCards({ ...getCurrentParams(), ...{ orderBy } });
  };

  return (
    <div className='container mx-auto my-8'>
      <Sidebar
        showCards={showCards}
        searchLoading={false}
        paramName={searchParams.get('pokemonName') || ''}
        paramEnergy={searchParams.get('searchEnergy')}
        paramSubType={searchParams.get('searchSubtypes')}
        paramSupertype={
          searchParams.get('supertype')?.split(',') as Supertype[]
        }
      />
      <div className='p-4 sm:ml-64'>
        <div className='flex justify-end'>
          {/* Sort By */}

          <div className='mb-4 text-right mr-4'>
            <label htmlFor='sortByFilter' className='mr-2'>
              Sort By:
            </label>
            <select
              id='sortByFilter'
              value={sortByChoice}
              onChange={(e) => handleSortByChange(e.target.value)}
              className='border rounded p-2 bg-black'
            >
              <option value={'-set.releaseDate'}>
                Set Release Date (Descending)
              </option>
              <option value={'set.releaseDate'}>
                Set Release Date (Ascending)
              </option>
              <option value={'-name'}>Name (Descending)</option>
              <option value={'name'}>Name (Ascending)</option>
              <option value={'-nationalPokedexNumbers'}>
                National Pokedex Number (Descending)
              </option>
              <option value={'nationalPokedexNumbers'}>
                National Pokedex Number (Ascending)
              </option>
              <option value={'-hp'}>HP (Descending)</option>
              <option value={'hp'}>HP (Ascending)</option>
            </select>
          </div>

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
        </div>

        <DisplayCards
          displayCards={displayCards}
          isSignedIn={isSignedIn}
          dataLoading={dataLoading}
        />
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
