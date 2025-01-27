import Image from 'next/image';
import Link from 'next/link';
import Terestal from '../../../public/assets/terestal_moonbreon.png';
import Moonbreaon from '../../../public/assets/moonbreon.png';
import Angry from '../../../public/assets/angrybreon.png';
import styles from './HomeContainer.module.scss';

const HomeContainer = () => {
  return (
    <div className={`${styles.container} ${styles.section}`}>
      <div
        className={`flex justify-center items-start flex-wrap ${styles.homeContainer}`}
      >
        <div className={`w-full md:w-1/2 text-left ${styles.cardText}`}>
          <h2 className='text-lg'>Gotta Collect 'Em All</h2>
          <p className='text-2xl sm:text-4xl mt-4'>
            Look up your favorite cards. Add them to personal collections. Be
            the very best, like no one ever was.
          </p>
          <p className='mt-6 text-center sm:text-left'>
            <Link href='/search/cards'>
              <button
                className='text-white px-4 py-2 rounded cursor-pointer'
                type='submit'
              >
                Search Cards
              </button>
            </Link>
          </p>
        </div>
        <div className={`w-full md:w-1/2 ${styles.cardContainer}`}>
          <Link
            href='search/cards/sv8pt5-161'
            className={`${styles.cardElement} ${styles.leftCard}`}
          >
            <Image
              src={Terestal}
              alt='Moonbreon Card'
              width={250}
              height={250}
            />
          </Link>
          <Link
            href='search/cards/swsh7-215'
            className={`${styles.cardElement} ${styles.middleCard}`}
          >
            <Image
              src={Moonbreaon}
              alt='Moonbreon Card'
              width={300}
              height={300}
            />
          </Link>
          <Link
            href='search/cards/swsh7-189'
            className={`${styles.cardElement} ${styles.rightCard}`}
          >
            <Image src={Angry} alt='Moonbreon Card' width={200} height={200} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeContainer;
