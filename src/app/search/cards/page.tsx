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
  const user = await currentUser();
  const likedCollection = await getCollectionByUserIDAndName(
    user?.id || '',
    process.env.NEXT_PUBLIC_FAVORITE_COLLECTION_NAME || ''
  );
  const likedCards = likedCollection
    ? await getCollectionCardIds(likedCollection._id)
    : [];
  const initialParams = await searchParams;
  const filteredParams = filterParams(initialParams);

  const initialCards = isEmptyObject(filteredParams)
    ? await getCardsByName({})
    : await getCardsByName(filteredParams);
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
