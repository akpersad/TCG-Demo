'use client';
import Sidebar from '@/components/Sidebar/Sidebar';
import DisplayCards from '@/components/DisplayCards/DisplayCards';
import Pagination from '@/components/Pagination/Pagination';
import NoResults from '@/components/NoResults/NoResults';
import { useState } from 'react';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { getCardsByName } from '@/app/utils/tcgClient';
import { CardsResponseProps, Collection, GetCardsProps } from '@/types/types';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { filterParams, filterValidParams } from '@/app/utils/app';
import { useUser } from '@clerk/nextjs';
import { Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import ChevronRight from '../../../public/chevron_right.svg';
import styles from './CardsContainer.module.scss';

interface Props extends CardsResponseProps {
  likedCollection?: Collection | null;
  likedCards: string[];
}

const CardsContainer = ({
  cards,
  totalCount,
  page,
  likedCollection,
  likedCards,
}: Props) => {
  const { isSignedIn } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [displayCards, setDisplayCards] = useState<PokemonTCG.Card[]>(cards);
  const [selectedPageSize, setSelectedPageSize] = useState<number>(12);
  const [sortByChoice, setSortByChoice] = useState<string>('-set.releaseDate');
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [totalCardCount, setTotalCardCount] = useState<number>(totalCount);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
      setIdArray: searchParams.get('setIdArray'),
      series: searchParams.get('series'),
      weaknesses: searchParams.get('weaknesses'),
      resistances: searchParams.get('resistances'),
      hpMin: searchParams.get('hpMin'),
      hpMax: searchParams.get('hpMax'),
      rarities: searchParams.get('rarities'),
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
      setIdArray: searchParams.get('setIdArray')?.split(',') || undefined,
      series: searchParams.get('series')?.split(',') || undefined,
      weaknesses: searchParams.get('weaknesses')?.split(',') || undefined,
      resistances: searchParams.get('resistances')?.split(',') || undefined,
      hpMin: searchParams.get('hpMin')
        ? parseInt(searchParams.get('hpMin')!, 10)
        : undefined,
      hpMax: searchParams.get('hpMax')
        ? parseInt(searchParams.get('hpMax')!, 10)
        : undefined,
      rarities: searchParams.get('rarities')?.split(',') || undefined,
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
    await showCards({
      ...getCurrentParams(),
      resetPageCount: true,
      ...{ pageSize },
    });
  };

  const handleSortByChange = async (orderBy: string) => {
    setSortByChoice(orderBy);
    await showCards({
      ...getCurrentParams(),
      resetPageCount: true,
      ...{ orderBy },
    });
  };

  return (
    <div className='flex relative z-1'>
      <div className={`${styles.sideMenuBtn} absolute sm:hidden`}>
        <button
          type='button'
          className={` hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500`}
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <Image src={ChevronRight} height={50} width={50} alt='Chevton' />

          <span className='sr-only'>Icon description</span>
        </button>
      </div>
      <Sidebar
        showCards={showCards}
        searchLoading={false}
        paramName={searchParams.get('pokemonName') || ''}
        paramEnergy={searchParams.get('searchEnergy')}
        paramSubType={searchParams.get('searchSubtypes')}
        paramSupertype={
          searchParams.get('supertype')?.split(',') as Supertype[]
        }
        showMobileMenu={showMobileMenu}
      />
      <div className={`py-4 px-5 mx-auto`}>
        {displayCards.length > 0 ? (
          <>
            <div className='flex justify-end flex-wrap'>
              {/* Sort By */}

              <div className='mb-4 text-right mr-0 md:mr-3 lg:mr-4'>
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

              {/* Result Count */}
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
              likedCollection={likedCollection}
              likedCards={likedCards}
            />
            {totalCardCount > selectedPageSize && (
              <Pagination
                totalCount={totalCardCount}
                pageSize={selectedPageSize}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <NoResults />
        )}
      </div>
    </div>
  );
};

export default CardsContainer;
