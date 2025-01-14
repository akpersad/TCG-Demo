'use server';
import React from 'react';
import { getCollectionAndItems } from '@/app/utils/mongoDB';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getCardsByName } from '@/app/utils/tcgClient';
import CollectionContainer from '@/components/CollectionContainer/CollectionContainer';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const user = await currentUser();
  const { status, collection, collectionItems } = id
    ? await getCollectionAndItems(id as string)
    : { status: 404, collection: null, collectionItems: [] };

  if (user?.id !== collection?.userID || status === 404) {
    redirect('/');
  }

  const collectionIds = collectionItems.map((item) => item.cardID);

  const cardsData = await getCardsByName({
    ids: collectionIds,
  });

  return (
    <>
      {collection && (
        <CollectionContainer
          collection={collection}
          collectionIds={collectionIds}
          {...cardsData}
        />
      )}
    </>
  );
}
