import Image from 'next/image';
import Link from 'next/link';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { useState } from 'react';
import Heart from '../../../public/assets/heart.svg';
import HeartOutline from '../../../public/assets/heart-outline.svg';
import styles from './CardWithInformation.module.scss';
import { Collection } from '@/types/types';
import { cardItemCollectionRequest } from '@/app/client';
import toast, { Toaster } from 'react-hot-toast';

interface Props {
  card: PokemonTCG.Card;
  isSignedIn?: boolean;
  likedCollection?: Collection | null;
  likedCards?: string[];
}

const CardWithInformation = ({
  card,
  isSignedIn,
  likedCollection,
  likedCards,
}: Props) => {
  const [showSavedToDB, setShowSavedToDB] = useState<boolean>(
    Boolean(likedCards?.includes(card.id))
  );

  const handleSaveToCollectionClick = async () => {
    const resp = await cardItemCollectionRequest(
      showSavedToDB ? 'removeCardFromCollection' : 'addCardToCollection',
      card,
      likedCollection!._id
    );
    setShowSavedToDB(!showSavedToDB);
    if (resp.status !== 200) {
      toast.error('Error saving card to collection');
    }
    console.log(`Save ${card.name} to collection id: ${likedCollection?._id}`);
  };

  return (
    <>
      <Toaster />
      <div className={`flex flex-col gap-2 relative ${styles.displayHeader}`}>
        {isSignedIn && likedCollection?._id && (
          <button
            className={styles.saveButton}
            onClick={() => {
              setShowSavedToDB(!showSavedToDB);
              handleSaveToCollectionClick();
            }}
          >
            <Image
              src={showSavedToDB ? Heart : HeartOutline}
              alt={`Save ${card.name} to collection id: ${likedCollection?._id}`}
              title='Save Card to Collection'
              height={20}
              width={20}
            />
          </button>
        )}
        <Link
          href={`/search/cards/${card.id}`}
          className='h-full flex flex-col justify-between'
        >
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
    </>
  );
};

export default CardWithInformation;
