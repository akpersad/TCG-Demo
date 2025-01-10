import Image from 'next/image';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import styles from './DisplayCards.module.scss';
import Link from 'next/link';
import Heart from '../../../public/assets/heart.svg';
import HeartOutline from '../../../public/assets/heart-outline.svg';
import { useState } from 'react';
import LoadingOverlay from '@/components/LoadingOverlay/LoadingOverlay';

interface DisplayCardsProps {
  displayCards?: PokemonTCG.Card[];
  isSignedIn?: boolean;
  dataLoading?: boolean;
}

const DisplayCards = ({
  displayCards,
  isSignedIn,
  dataLoading,
}: DisplayCardsProps) => {
  const [showSavedToDB, setShowSavedToDB] = useState<boolean>(false);
  return (
    <div className='relative'>
      {dataLoading && <LoadingOverlay />}
      <div className='grid grid-cols-4 gap-5'>
        {displayCards?.map((card, index) => (
          <div
            key={index}
            className={`flex flex-col flex-wrap gap-2 relative ${styles.displayHeader}`}
          >
            {isSignedIn && (
              <button
                className={styles.saveButton}
                onClick={() => {
                  setShowSavedToDB(!showSavedToDB);
                  console.log(`save card ${card.id}`);
                }}
              >
                <Image
                  src={showSavedToDB ? HeartOutline : Heart}
                  alt={`Save ${card.name} to collection`}
                  title='Save Card to Collection'
                  height={40}
                  width={40}
                />
              </button>
            )}
            <Link href={`/search/cards/${card.id}`}>
              <h2 className='capitalize text-lg font-semibold'>{card.name}</h2>
              <Image
                src={card.images.small}
                alt={card.name}
                width={300}
                height={500}
                className={styles.card}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayCards;
