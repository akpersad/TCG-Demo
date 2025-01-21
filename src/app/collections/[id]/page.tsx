'use server';
import React from 'react';
import { getCollectionAndItems } from '@/app/utils/mongoDB';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getCardsByName } from '@/app/utils/tcgClient';
import CollectionContainer from '@/components/CollectionContainer/CollectionContainer';
import { filterParams } from '@/app/utils/app';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const user = await currentUser();
  const { status, collection, collectionItems } = id
    ? await getCollectionAndItems(id as string)
    : { status: 404, collection: null, collectionItems: [] };

  if (user?.id !== collection?.userID || status === 404) {
    redirect('/');
  }

  const collectionIds = collectionItems.map((item) => item.cardID);
  const initialParams = await searchParams;
  const filteredParams = filterParams(initialParams);

  const cardsData = await getCardsByName({
    ids: collectionIds,
    ...filteredParams,
  });

  return (
    <>
      {collection && user?.id && (
        <CollectionContainer
          userID={user.id}
          collection={collection}
          collectionIds={collectionIds}
          {...cardsData}
        />
      )}
    </>
  );
}
