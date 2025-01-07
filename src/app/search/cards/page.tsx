'use server';
import CardsContainer from '@/components/CardsContainer/CardsContainer';
import { getInitialCards } from '@/app/actions';

const CardsPage = async () => {
  const initialCards = await getInitialCards();
  return <CardsContainer initialCards={initialCards} />;
};

export default CardsPage;
