import { GroupedSet } from '@/types/types';
import styles from './SetsContainer.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import ApiStatusModal from '@/components/ApiStatusModal/ApiStatusModal';

type Props = {
  sets: GroupedSet[];
};

const SetsContainer = ({ sets }: Props) => {
  return (
    <div className='container mx-auto sm:my-8 px-4'>
      <ApiStatusModal />
      {sets.map((group) => (
        <div key={group.series} className='rounded-lg mb-8'>
          <h2 className='text-xl sm:text-3xl font-semibold py-2 sm:py-4'>
            {group.series}
          </h2>
          <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
            {group.sets.map((set) => (
              <Link
                key={set.id}
                href={`/search/cards?setId=${set.id}`}
                className={`rounded-lg bg-white dark:bg-gray-800 p-3 text-center h-full ${styles.cardBox}`}
              >
                <Image
                  src={set.images.logo}
                  alt={set.name}
                  width={500}
                  height={500}
                  className='w-full sm:h-48 object-contain'
                />
                <div className='p-4'>
                  <h3 className='text-base sm:text-xl font-semibold'>
                    {set.name}
                  </h3>
                  <p className='text-sm sm:text-base'>
                    {new Date(set.releaseDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className='text-sm sm:text-base'>{set.total} cards</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SetsContainer;
