export const dynamic = 'force-dynamic';

import { getCardById } from '@/app/utils/tcgClient';
import { redirect } from 'next/navigation';
import Image from 'next/image';

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
      <div>My Post: {id}</div>
      {response.card && (
        <>
          <div>Name {response.card.name}</div>
          <Image
            src={response.card.images.large}
            alt={response.card.name}
            width={500}
            height={700}
          />
        </>
      )}
    </div>
  );
}
