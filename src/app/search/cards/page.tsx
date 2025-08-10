'use server';
import { Suspense } from 'react';
import CardsContainer from '@/components/CardsContainer/CardsContainer';
import { getCardsByName } from '@/app/utils/tcgClient';
import { filterParams, isEmptyObject } from '@/app/utils/app';
import { currentUser } from '@clerk/nextjs/server';
import {
  getCollectionByUserIDAndName,
  getCollectionCardIds,
} from '@/app/utils/mongoDB';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const CardsPage = async ({ searchParams }: Props) => {
  const userPromise = currentUser();

  // Resolve search params and build query
  const initialParams = await searchParams;
  const filteredParams = filterParams(initialParams);

  // Fire the cards request ASAP (independent of user/collections)
  const cardsPromise = isEmptyObject(filteredParams)
    ? getCardsByName({})
    : getCardsByName(filteredParams);

  // Fetch liked collection and ids in parallel, only if user exists
  const likedCollectionPromise = (async () => {
    const user = await userPromise;
    if (!user?.id) return null;
    return getCollectionByUserIDAndName(
      user.id,
      process.env.NEXT_PUBLIC_FAVORITE_COLLECTION_NAME || ''
    );
  })();

  const likedCardsPromise = (async () => {
    const collection = await likedCollectionPromise;
    if (!collection?._id) return [] as string[];
    return getCollectionCardIds(collection._id);
  })();

  const [initialCards, likedCollection, likedCards] = await Promise.all([
    cardsPromise,
    likedCollectionPromise,
    likedCardsPromise,
  ]);
  return (
    <Suspense
      fallback={
        <div className='w-full animate-pulse'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {[...Array(12)].map((_, i) => (
              <div key={i} className='h-64 bg-gray-200 rounded-md'></div>
            ))}
          </div>
        </div>
      }
    >
      <CardsContainer
        cards={initialCards.cards}
        page={initialCards.page}
        pageSize={initialCards.pageSize}
        count={initialCards.count}
        totalCount={initialCards.totalCount}
        likedCollection={likedCollection}
        likedCards={likedCards}
      />
    </Suspense>
  );
};

export default CardsPage;
