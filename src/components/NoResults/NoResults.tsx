import Image from 'next/image';
import Psyduck from '../../../public/assets/confused_psyduck.gif';
import Link from 'next/link';

const NoResults = () => {
  return (
    <div className='flex flex-col items-center justify-center h-full p-4'>
      <div className='text-center'>
        <p className='text-2xl font-bold mb-4'>No Results Found</p>
        <Image src={Psyduck} alt='No Results' height={500} width={500} />
        <p className='mt-4 text-lg'>
          <Link
            href={'/search/advanced-search'}
            className='text-blue-500 underline'
          >
            Try searching
          </Link>{' '}
          with different criteria!
        </p>
      </div>
    </div>
  );
};

export default NoResults;
