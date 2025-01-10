import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import LoadingOverlay from '@/components/LoadingOverlay/LoadingOverlay';
import CardWithInformation from '@/components/CardWithInformation/CardWithInformation';

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
  return (
    <div className='relative'>
      {dataLoading && <LoadingOverlay />}
      <div className='grid grid-cols-4 gap-5'>
        {displayCards?.map((card, index) => (
          <CardWithInformation
            key={`display-card-${card.id}-${index}`}
            card={card}
            isSignedIn={isSignedIn}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayCards;
