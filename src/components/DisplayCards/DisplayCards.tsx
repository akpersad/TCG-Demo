import Image from 'next/image';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import styles from './DisplayCards.module.scss';

interface DisplayCardsProps {
  displayCards?: PokemonTCG.Card[];
}

const DisplayCards = ({ displayCards }: DisplayCardsProps) => {
  return (
    <div className='grid grid-cols-4 gap-5'>
      {displayCards?.map((card, index) => (
        <div
          key={index}
          className={`flex flex-col flex-wrap gap-2 ${styles.displayHeader}`}
        >
          <h2 className='capitalize text-lg font-semibold'>{card.name}</h2>
          <Image
            src={card.images.small}
            alt={card.name}
            width={300}
            height={500}
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayCards;
