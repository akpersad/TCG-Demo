'use server';
import CardsContainer from '@/components/CardsContainer/CardsContainer';
import { getCardsByName } from '@/app/utils/tcgClient';
import { filterParams, isEmptyObject } from '@/app/utils/app';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const CardsPage = async ({ searchParams }: Props) => {
  const initialParams = await searchParams;

  const filteredParams = filterParams(initialParams);

  const initialCards = isEmptyObject(filteredParams)
    ? await getCardsByName({ pokemonName: 'charizard' })
    : await getCardsByName(filteredParams);
  return (
    <CardsContainer
      cards={initialCards.cards}
      page={initialCards.page}
      pageSize={initialCards.pageSize}
      count={initialCards.count}
      totalCount={initialCards.totalCount}
    />
  );
};

export default CardsPage;
