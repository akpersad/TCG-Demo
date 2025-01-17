'use client';

import { cardItemCollectionRequest } from '@/app/client';
import { Collection } from '@/types/types';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { useState } from 'react';
import LoadingOverlay from '@/components/LoadingOverlay/LoadingOverlay';
import toast, { Toaster } from 'react-hot-toast';

type Props = {
  collections: Collection[];
  cardData: PokemonTCG.Card;
};

const AddToCollection = ({ collections, cardData }: Props) => {
  const [selectedCollection, setSelectedCollection] = useState('');
  const [dataLoading, setDataLoading] = useState(false);

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setDataLoading(true);
    const index = collections.findIndex(
      (collection) => collection._id === selectedCollection
    );
    if (index === -1) {
      setDataLoading(false);
      toast.error('No Collection selected');
      return;
    }

    const response = await cardItemCollectionRequest(
      'addCardToCollection',
      cardData,
      selectedCollection
    );

    if (response.status !== 200) {
      toast.error('Error adding card to collection');
    }

    if (response.status === 200) {
      toast.success('Card added to collection');
    }
    setDataLoading(false);
  };

  return (
    <>
      <div className='my-6 pt-6 relative'>
        <Toaster />
        {dataLoading && <LoadingOverlay />}
        <h4 className='text-xl'>Add to Collection</h4>
        <div className='flex justify-between flex-wrap mt-4'>
          <div className='addToForm'>
            <form className='max-w-md mx-auto' onSubmit={handleFormSubmission}>
              <select
                id='sortByFilter'
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className='border rounded p-2 bg-black'
              >
                <option disabled value=''>
                  Select Collection
                </option>
                {collections.map((collection) => (
                  <option
                    key={`add-to-${collection._id}`}
                    value={collection._id}
                  >
                    {collection.name}
                  </option>
                ))}
              </select>

              <button
                type='submit'
                className='bg-blue-500 text-white rounded p-2 mt-4 ml-6 disabled:opacity-50'
                disabled={!Boolean(selectedCollection)}
              >
                Add Card
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddToCollection;
