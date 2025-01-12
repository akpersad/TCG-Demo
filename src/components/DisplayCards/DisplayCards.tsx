import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import LoadingOverlay from '@/components/LoadingOverlay/LoadingOverlay';
import CardWithInformation from '@/components/CardWithInformation/CardWithInformation';
import { Collection } from '@/types/types';

interface DisplayCardsProps {
  displayCards?: PokemonTCG.Card[];
  isSignedIn?: boolean;
  dataLoading?: boolean;
  likedCollection?: Collection | null;
  likedCards?: string[];
}

const DisplayCards = ({
  displayCards,
  isSignedIn,
  dataLoading,
  likedCollection,
  likedCards,
}: DisplayCardsProps) => {
  return (
    <div className='relative'>
      {dataLoading && <LoadingOverlay />}
      <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4'>
        {displayCards?.map((card, index) => (
          <CardWithInformation
            key={`display-card-${card.id}-${index}`}
            card={card}
            isSignedIn={isSignedIn}
            likedCollection={likedCollection}
            likedCards={likedCards}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayCards;
