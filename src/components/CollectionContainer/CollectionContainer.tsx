'use client';
import { filterParams } from '@/app/utils/app';
import { getCardsByName } from '@/app/utils/tcgClient';
import { CardsResponseProps, Collection, GetCardsProps } from '@/types/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { Supertype } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import DisplayCards from '@/components/DisplayCards/DisplayCards';
import Pagination from '@/components/Pagination/Pagination';
import { updateCollectionRequest } from '@/app/client';
import LoadingOverlay from '@/components/LoadingOverlay/LoadingOverlay';
import NoResults from '@/components/NoResults/NoResults';

interface Props extends CardsResponseProps {
  collectionIds: string[];
  collection: Collection;
  userID: string;
}

const CollectionContainer = ({
  cards,
  totalCount,
  page,
  collectionIds,
  collection,
  userID,
}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [displayCards, setDisplayCards] = useState<PokemonTCG.Card[]>(cards);
  const [selectedPageSize, setSelectedPageSize] = useState<number>(12);
  const [sortByChoice, setSortByChoice] = useState<string>('-set.releaseDate');
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [totalCardCount, setTotalCardCount] = useState<number>(totalCount);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [isEditState, setIsEditState] = useState<boolean>(false);
  // Collection specific states
  const [collectionName, setCollectionName] = useState<string>(collection.name);
  const [collectionDescription, setCollectionDescription] = useState<string>(
    collection.description
  );
  const [isSubmissionPending, setIsSubmissionPending] =
    useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterValidParams = (params: Record<string, any>) => {
    return Object.fromEntries(
      Object.entries(params).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          value !== '' &&
          (Array.isArray(value) ? value.length > 0 : true)
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

    router.push(`${pathname}?${updatedParams}`);

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
      ids: collectionIds,
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

  const handleCollectionFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      collectionName === collection.name &&
      collectionDescription === collection.description
    ) {
      setIsEditState(false);
      return;
    }

    setIsSubmissionPending(true);
    const response = await updateCollectionRequest({
      collectionID: collection._id,
      collectionName,
      collectionDescription,
    });
    if (response.status !== 200) {
      setIsSubmissionPending(false);
      handleFormCancel();
      return;
    }

    setCollectionName(collectionName);
    setCollectionDescription(collectionDescription);
    setIsSubmissionPending(false);
    setIsEditState(false);
  };

  const handleFormCancel = () => {
    setCollectionName(collection.name);
    setCollectionDescription(collection.description);
    setIsEditState(false);
  };

  return (
    <div className='container flex'>
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
      <div className=''>
        {!isEditState && (
          <div className='flex mb-4 justify-between items-center'>
            <div>
              <h2 className='text-2xl'>{collection.name}</h2>
              <span className='text-base text-gray-500 break-all'>
                {collection.description}
              </span>
            </div>
            <div className='ml-2'>
              <button
                className='bg-blue-500 text-white px-4 py-2 rounded min-w-max'
                onClick={() => setIsEditState(true)}
              >
                Edit Collection Information
              </button>
            </div>
          </div>
        )}

        {isSubmissionPending && <LoadingOverlay />}

        {isEditState && userID === collection.userID && (
          <form
            onSubmit={handleCollectionFormSubmit}
            onReset={handleFormCancel}
          >
            <div className='grid grid-cols-1 md:grid-cols-2 md:gap-6 mb-4'>
              <div className='flex flex-col w-full'>
                <div className='relative z-0 w-full mb-5 group'>
                  <input
                    onChange={(e) => setCollectionName(e.target.value)}
                    type='text'
                    name='floating_name'
                    id='floating_name'
                    className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer  disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed'
                    placeholder=' '
                    value={collectionName}
                    disabled={
                      collectionName ===
                      process.env.NEXT_PUBLIC_FAVORITE_COLLECTION_NAME
                    }
                    required
                  />
                  <label
                    htmlFor='floating_name'
                    className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                  >
                    Collection Name
                  </label>
                </div>
                <div className='relative z-0 w-full mb-5 group'>
                  <textarea
                    onChange={(e) => setCollectionDescription(e.target.value)}
                    name='floating_description'
                    id='floating_description'
                    className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                    placeholder=' '
                    value={collectionDescription}
                    rows={1}
                  />
                  <label
                    htmlFor='floating_description'
                    className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                  >
                    Collection Description
                  </label>
                </div>
              </div>
              <div className='flex sm:mt-0 mt-5 md:text-right justify-between items-start sm:justify-end'>
                <button
                  className='bg-gray-500 text-white px-4 py-2 rounded'
                  type='reset'
                >
                  Cancel
                </button>
                <button
                  className='bg-blue-500 text-white px-4 py-2 rounded md:ml-2'
                  type='submit'
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        )}
        {displayCards.length > 0 ? (
          <>
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
              isSignedIn
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
          </>
        ) : (
          <NoResults />
        )}
      </div>
    </div>
  );
};

export default CollectionContainer;
