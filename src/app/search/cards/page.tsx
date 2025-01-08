'use server';
import CardsContainer from '@/components/CardsContainer/CardsContainer';
import { getInitialCards } from '@/app/actions';

const CardsPage = async () => {
  const initialCards = await getInitialCards();
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
