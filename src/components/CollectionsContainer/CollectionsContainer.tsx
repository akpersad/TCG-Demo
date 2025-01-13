'use client';
import { useState, useEffect } from 'react';
import { Collection } from '@/types/types';
import { createNewCollectionRequest } from '@/app/client';
import LoadingOverlay from '@/components/LoadingOverlay/LoadingOverlay';

type Props = {
  userCollections: Collection[];
  userID: string;
};

const CollectionsContainer = ({ userCollections, userID }: Props) => {
  const [userCollectionsStateObject, setUserCollectionsStateObject] =
    useState<Collection[]>(userCollections);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if ((e.target as Element).classList.contains('modal-overlay')) {
      closeModal();
    }
  };

  const handleEscKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await createNewCollectionRequest({
      userID,
      collectionName: newCollectionName,
      collectionDescription: newCollectionDescription,
    });
    const date = new Date();
    const tempDisplayCollections = [
      ...userCollectionsStateObject,
      {
        _id: 'tempID',
        userID,
        name: newCollectionName,
        description: newCollectionDescription,
        cardCount: 0,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
      },
    ];
    setUserCollectionsStateObject(tempDisplayCollections);
    setIsSubmitting(false);
    closeModal();
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', handleEscKey);
    } else {
      document.removeEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isModalOpen]);

  return (
    <div className='container mx-auto my-8'>
      <div className='flex justify-between mb-8'>
        <h2 className='text-2xl'>Collections Page</h2>
        {userCollectionsStateObject.length < 5 && userID && (
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded'
            onClick={openModal}
          >
            Create New Collection
          </button>
        )}
      </div>
      {userCollectionsStateObject.length > 0 && (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6'>
            {userCollectionsStateObject.map((collection) => (
              <div
                key={collection._id}
                className='border rounded-lg p-4 shadow-md bg-white dark:bg-gray-800'
              >
                <h2 className='text-lg font-bold mb-2'>{collection.name}</h2>
                {collection.description && (
                  <p className='text-gray-600 dark:text-gray-400 mb-2 break-words'>
                    {collection.description}
                  </p>
                )}
                {collection.cardCount > 0 && (
                  <p className='text-gray-500 dark:text-gray-300 mb-2'>
                    {collection.cardCount}{' '}
                    {collection.cardCount > 1 ? 'cards' : 'card'}
                  </p>
                )}
                <p className='text-gray-500 dark:text-gray-300 mb-4'>
                  Created on:{' '}
                  {new Date(collection.createdAt).toLocaleDateString('en-US')}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {isModalOpen && (
        <div
          className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 modal-overlay'
          onClick={handleOutsideClick}
        >
          <div className='border-gray-200 bg-gray-50 dark:bg-gray-800 p-8 rounded shadow-lg max-w-md w-full relative'>
            <button
              onClick={closeModal}
              className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
            >
              &times;
            </button>
            <h2 className='text-xl font-bold mb-4'>Add New Collection</h2>
            {isSubmitting && <LoadingOverlay />}
            <div className='collection-form'>
              <form
                className='max-w-md mx-auto'
                onSubmit={handleFormSubmission}
              >
                <div className='relative z-0 w-full mb-5 group'>
                  <input
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    type='text'
                    name='floating_name'
                    id='floating_name'
                    className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                    placeholder=' '
                    required
                  />
                  <label
                    htmlFor='floating_name'
                    className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                  >
                    Collection Name*
                  </label>
                </div>

                <div className='relative z-0 w-full mb-5 group'>
                  <textarea
                    onChange={(e) =>
                      setNewCollectionDescription(e.target.value)
                    }
                    name='floating_description'
                    id='floating_description'
                    className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                    placeholder=' '
                  />
                  <label
                    htmlFor='floating_description'
                    className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                  >
                    Collection Description
                  </label>
                </div>
                <div className='flex justify-end'>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      closeModal();
                    }}
                    className='bg-blue-500 text-white px-4 py-2 rounded mr-6'
                  >
                    Close
                  </button>
                  <button className='bg-blue-500 text-white px-4 py-2 rounded'>
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsContainer;
