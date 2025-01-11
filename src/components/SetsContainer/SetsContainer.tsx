import { GroupedSet } from '@/types/types';
import styles from './SetsContainer.module.scss';
import Link from 'next/link';

type Props = {
  sets: GroupedSet[];
};

const SetsContainer = ({ sets }: Props) => {
  return (
    <div className='container mx-auto my-8'>
      <div className='grid grid-cols-1 gap-4'>
        {sets.map((group) => (
          <div key={group.series} className='rounded-lg'>
            <h2 className='text-3xl font-semibold p-4'>{group.series}</h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {group.sets.map((set) => (
                <Link
                  key={`${set.id}-grid-view`}
                  href={`/search/cards?setId=${set.id}`}
                >
                  <div
                    className={`rounded-lg bg-white dark:bg-gray-800 p-3 text-center h-full ${styles.cardBox}`}
                  >
                    <img
                      src={set.images.logo}
                      alt={set.name}
                      className='w-full h-48 object-contain'
                    />
                    <div className='p-4'>
                      <h3 className='text-xl font-semibold'>{set.name}</h3>
                      <p>
                        {new Date(set.releaseDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p>{set.total} cards</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetsContainer;
