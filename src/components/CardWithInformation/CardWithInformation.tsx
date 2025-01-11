import Image from 'next/image';
import Link from 'next/link';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { useState } from 'react';
import Heart from '../../../public/assets/heart.svg';
import HeartOutline from '../../../public/assets/heart-outline.svg';
import styles from './CardWithInformation.module.scss';

interface Props {
  card: PokemonTCG.Card;
  isSignedIn?: boolean;
}

const CardWithInformation = ({ card, isSignedIn }: Props) => {
  const [showSavedToDB, setShowSavedToDB] = useState<boolean>(false);
  return (
    <div
      className={`flex flex-col flex-wrap gap-2 relative ${styles.displayHeader} h-full`}
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
  );
};

export default CardWithInformation;
