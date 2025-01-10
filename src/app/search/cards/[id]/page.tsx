'use server';
import { getCardById } from '@/app/utils/tcgClient';
import CardContainer from '@/components/CardContainer/CardContainer';
import { redirect } from 'next/navigation';

const getCardWithId = async (id: string) => {
  return await getCardById(id);
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const response = await getCardWithId(id);

  if (response.status !== 200) {
    redirect('/search/cards');
  }

  return (
    <div className='container mx-auto my-auto'>
      {response.card && <CardContainer cardData={response.card} />}
    </div>
  );
}
