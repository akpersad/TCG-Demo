import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import Image from 'next/image';
import AbilityImage from '../../../public/assets/ability.png';
import PokeBodyImage from '../../../public/assets/pokebody.png';
import PokePowerImage from '../../../public/assets/pokepower.png';
import { energyJSON } from '@/constants/energy';
import styles from './CardContainer.module.scss';
import { useMemo } from 'react';
import Link from 'next/link';
import { Collection } from '@/types/types';
import AddToCollection from '@/components/AddToCollection/AddToCollection';
import { Price } from 'pokemon-tcg-sdk-typescript/dist/sdk';

type Props = {
  cardData: PokemonTCG.Card;
  userID?: string;
  collections?: Collection[];
};

const CardContainer = ({ cardData, userID, collections }: Props) => {
  const getAbilityImage = (ability: string) => {
    switch (ability) {
      case 'Ability':
        return AbilityImage;
      case 'Poké-Body':
        return PokeBodyImage;
      case 'Poké-Power':
        return PokePowerImage;
      default:
        return AbilityImage;
    }
  };

  const getCardTypeDetails = (cardType: string) => {
    const typeIndex = energyJSON.findIndex(
      (energy) => energy.name === cardType
    );
    const energy = energyJSON[typeIndex >= 0 ? typeIndex : 0];
    return energy;
  };

  const statsObject = useMemo(() => {
    const stats = [
      {
        statName: 'Weakness',
        statType: 'weaknesses',
        values: cardData.weaknesses?.map((weakness) => {
          const typeObj = getCardTypeDetails(weakness.type);
          return {
            type: typeObj,
            value: weakness.value,
          };
        }),
      },
      {
        statName: 'Resistance',
        statType: 'resistances',
        values: cardData.resistances?.map((resistance) => {
          const typeObj = getCardTypeDetails(resistance.type);
          return {
            type: typeObj,
            value: resistance.value,
          };
        }),
      },
      {
        statName: 'Retreat Cost',
        statType: 'weaknesses',
        values: cardData.retreatCost?.map((retreat) => {
          const typeObj = getCardTypeDetails(retreat);
          return { type: typeObj, value: '' };
        }),
      },
    ];
    return stats;
  }, [cardData]);

  const convertPrice = (price?: number | null) =>
    price ? `$${price.toFixed(2)}` : '';

  const priceFragments = (priceObj: {
    normal?: Price;
    holofoil?: Price;
    reverseHolofoil?: Price;
  }) => {
    const typeMapping = {
      normal: 'Normal',
      holofoil: 'Holofoil',
      reverseHolofoil: 'Reverse Holofoil',
    };
    const cardVersions = Object.keys(priceObj);
    return cardVersions.map((version) => {
      const price = priceObj[version as keyof typeof priceObj];
      if (price) {
        return (
          <div
            key={`price-${version}`}
            className={`${styles.priceContainer} mt-6`}
          >
            <div className='calcHeader text-left text-base'>
              {typeMapping[version as keyof typeof typeMapping]}
            </div>
            <div className='flex justify-between flex-wrap mt-4'>
              {/* Market */}
              <div className={`flex flex-col`}>
                <div className='calcHeader text-center text-sm'>Market</div>
                <div className='calcBody flex mt-2 text-lg text-center'>
                  <p className='flex justify-center items-center'>
                    {convertPrice(price.market)}
                  </p>
                </div>
              </div>
              {/* Low */}
              <div className={`flex flex-col`}>
                <div className='calcHeader text-center text-sm'>Low</div>
                <div className='calcBody flex mt-2 text-lg text-center'>
                  <p className='flex justify-center items-center'>
                    {convertPrice(price.low)}
                  </p>
                </div>
              </div>
              {/* Mid */}
              <div className={`flex flex-col`}>
                <div className='calcHeader text-center text-sm'>Mid</div>
                <div className='calcBody flex mt-2 text-lg text-center'>
                  <p className='flex justify-center items-center'>
                    {convertPrice(price.mid)}
                  </p>
                </div>
              </div>
              {/* High */}
              <div className={`flex flex-col`}>
                <div className='calcHeader text-center text-sm'>High</div>
                <div className='calcBody flex mt-2 text-lg text-center'>
                  <p className='flex justify-center items-center'>
                    {convertPrice(price.high)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }
    });
  };

  return (
    <div className='card-container container mx-auto my-auto grid sm:grid-cols-2 gap-4 mt-10 px-2'>
      <div className=''>
        <Image
          src={cardData.images.large}
          alt={cardData.name}
          width={500}
          height={700}
        />
      </div>
      <div className='divide-y-2 divide-gray-300'>
        <div className='pb-6'>
          <div className='flex justify-between'>
            <div className=''>
              {/* Name */}
              <Link
                href={`/search/cards?pokemonName=${cardData.name}`}
                className='text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
              >
                <h2 className='text-4xl font-bold'>{cardData.name}</h2>
              </Link>

              <h3 className='text-xl'>
                {/* Card Type and SubType */}
                {cardData.supertype} | {cardData.subtypes.join(', ')}
              </h3>
            </div>
            <div className='flex items-center'>
              {/* Type and HP */}
              {cardData.supertype === 'Pokémon' && (
                <span className='pr-3 text-lg'>{`HP ${cardData.hp}`}</span>
              )}
              {cardData.types && (
                <span>
                  {cardData.types.map((type) => {
                    const typeObj = getCardTypeDetails(type);
                    return (
                      <Image
                        key={`${typeObj.name}-type-${cardData.id}`}
                        src={typeObj.image}
                        alt={typeObj.name}
                        width={35}
                        height={35}
                      />
                    );
                  })}
                </span>
              )}
            </div>
          </div>
          {cardData.flavorText && (
            <div className='mt-4 text-sm'>{cardData.flavorText}</div>
          )}
          {cardData.evolvesFrom && (
            <div className='mt-4 text-sm'>
              Evolves from:{' '}
              <Link
                href={`/search/cards?pokemonName=${cardData.evolvesFrom}`}
                className='text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
              >
                {cardData.evolvesFrom}
              </Link>
            </div>
          )}

          {cardData.evolvesTo && (
            <div className='mt-4 text-sm'>
              Evolves to:{' '}
              {cardData.evolvesTo.map((evolution, index) => {
                return (
                  <span
                    key={`evolves-to-map-${evolution}-${index}-${cardData.id}`}
                  >
                    <Link
                      href={`/search/cards?pokemonName=${evolution}`}
                      className='text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                    >
                      {evolution}
                    </Link>
                    {index < cardData.evolvesTo!.length - 1 && ', '}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        {/* Ability */}
        {cardData.supertype === 'Pokémon' && cardData.abilities && (
          <div className='my-6 pb-6'>
            {cardData.abilities.map((ability) => (
              <div key={`${ability.name}-ability-${cardData.id}`}>
                <div className='flex'>
                  <Image
                    src={getAbilityImage(ability.type)}
                    alt={cardData.name}
                    width={100}
                    height={25}
                  />
                  <span className='text-xl ml-4'>{ability.name}</span>
                </div>
                <p className='mt-5'>
                  <span className='text-base'>{ability.text}</span>
                </p>
              </div>
            ))}
          </div>
        )}
        {/* Attacks */}
        {cardData.supertype === 'Pokémon' && cardData.attacks && (
          <div className='my-6 pb-6'>
            {cardData.attacks.map((attack) => (
              <div
                key={`${attack.name}-attack-${cardData.id}`}
                className={`${styles.attackContainer} mt-4`}
              >
                <div className='flex items-center justify-between'>
                  <div className='typeContainer flex'>
                    {attack.cost.map((individualCost, index) => {
                      const typeObj = getCardTypeDetails(individualCost);
                      return (
                        <Image
                          key={`${individualCost}-cost-${cardData.id}-${index}`}
                          src={typeObj.image}
                          alt={typeObj.name}
                          width={30}
                          height={30}
                          className='mr-1'
                        />
                      );
                    })}
                  </div>
                  <span className='text-xl'>{attack.name}</span>
                  <span className='text-xl'>{attack.damage}</span>
                </div>
                <div className='text-lg mt-3'>{attack.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* Weakness, Resistance, Retreat */}
        {cardData.supertype === 'Pokémon' && (
          <div className='my-6 pb-6 bottomInfoContainer'>
            <div className='flex justify-between'>
              {statsObject.map((stat) => {
                return (
                  <div
                    key={`stat-obj-${stat.statName}-container`}
                    className='flex flex-col'
                  >
                    <div className='calcHeader text-center text-sm'>
                      {stat.statName}
                    </div>
                    <div className='calcBody flex mt-2'>
                      {stat.values?.map((value, index) => {
                        return (
                          <p
                            key={`${value.type.name}-stat-${cardData.id}-${index}`}
                            className='flex justify-center items-center mr-1'
                          >
                            <Image
                              src={value.type.image}
                              alt={value.type.name}
                              width={30}
                              height={30}
                            />
                            {value.value && (
                              <span className='ml-3 text-lg'>
                                {value.value}
                              </span>
                            )}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(cardData.supertype === 'Trainer' ||
          cardData.supertype === 'Energy') &&
          cardData.rules && (
            <div className='my-6 pb-6 bottomInfoContainer'>
              <div className='flex justify-between'>
                <div className='flex flex-col'>
                  <h4 className='text-xl'>Rules</h4>
                  <div className='calcBody flex mt-2'>
                    <p className='flex justify-center items-center'>
                      {cardData.rules[0]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Set Information */}
        <div className='my-6 pb-6 setInfoContainer'>
          <h4 className='text-xl'>Set Information</h4>
          <div className='flex justify-between flex-wrap mt-4'>
            {/* Series Name */}
            <div className={`flex flex-col ${styles.setItems}`}>
              <div className='calcHeader text-center text-sm'>Series</div>
              <div className='calcBody flex mt-2 text-lg'>
                <p className='flex justify-center items-center'>
                  {cardData.set.series}
                </p>
              </div>
            </div>

            {/* Set Name */}
            <div className={`flex flex-col ${styles.setItems}`}>
              <div className='calcHeader text-center text-sm'>Set</div>
              <div className='calcBody flex mt-2 text-lg'>
                <p className='flex justify-center items-center'>
                  <span className='mr-2'>
                    <Link
                      href={`/search/cards?setId=${cardData.set.id}`}
                      className='text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                    >
                      {cardData.set.name}
                    </Link>
                  </span>
                  <Image
                    src={cardData.set.images.symbol}
                    alt={cardData.set.name}
                    width={25}
                    height={25}
                  />
                </p>
              </div>
            </div>

            {/* Set Logo */}
            <div className={`flex flex-col ${styles.setItems}`}>
              <div className='calcHeader text-center text-sm'>Logo</div>
              <div className='calcBody flex mt-2 text-lg'>
                <Image
                  src={cardData.set.images.logo}
                  alt={cardData.set.name}
                  width={75}
                  height={75}
                />
              </div>
            </div>
          </div>
          <div className='flex justify-between flex-wrap mt-8'>
            {/* Set Number */}
            <div className={`flex flex-col ${styles.setItems}`}>
              <div className='calcHeader text-center text-sm'>Number</div>
              <div className='calcBody flex mt-2 text-lg'>
                <p className='flex justify-center items-center'>{`${cardData.number} / ${cardData.set.printedTotal}`}</p>
              </div>
            </div>

            {/* Rarity */}
            <div className={`flex flex-col ${styles.setItems}`}>
              <div className='calcHeader text-center text-sm'>Rarity</div>
              <div className='calcBody flex mt-2 text-lg'>
                <p className='flex justify-center items-center'>
                  <Link
                    href={`/search/cards?rarities=${cardData.rarity}`}
                    className='text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                  >
                    {cardData.rarity}
                  </Link>
                </p>
              </div>
            </div>

            {/* Artist */}
            <div className={`flex flex-col ${styles.setItems}`}>
              <div className='calcHeader text-center text-sm'>Artist</div>
              <div className='calcBody flex mt-2 text-lg'>
                <p className='flex justify-center items-center'>
                  <Link
                    href={`/search/cards?artist=${cardData.artist}`}
                    className='text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                  >
                    {cardData.artist}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Pricing */}
        {cardData.tcgplayer && (
          <div className='my-6 pb-6'>
            <div className='flex items-end'>
              <h4 className='text-xl mr-4'>Price Information</h4>
              <span className='text-sm'>
                Last updated: {cardData.tcgplayer.updatedAt}
              </span>
            </div>
            <div>
              <Link href={cardData.tcgplayer.url} target='_blank'>
                Buy on TCG Player
              </Link>
            </div>
            {/* <div className='flex justify-between flex-wrap mt-4'> */}
            {priceFragments(cardData.tcgplayer.prices)}
            {/* </div> */}
          </div>
        )}

        {/* Add To Collection */}
        {userID && collections && collections?.length > 0 && (
          <AddToCollection collections={collections} cardData={cardData} />
        )}
      </div>
    </div>
  );
};

export default CardContainer;
