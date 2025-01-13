'use client';
import { useState, useEffect } from 'react';
import { Collection } from '@/types/types';

type Props = {
  userCollections: Collection[];
};

const CollectionsContainer = ({ userCollections }: Props) => {
  const [userCollectionsStateObject, setUserCollectionsStateObject] =
    useState<Collection[]>(userCollections);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        {userCollectionsStateObject.length < 5 && (
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded'
            onClick={openModal}
          >
            Create Collection
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
                  <p className='text-gray-600 dark:text-gray-400 mb-2'>
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
            <h2 className='text-xl font-bold mb-4'>Header</h2>
            Body
            <button
              onClick={closeModal}
              className='bg-blue-500 text-white px-4 py-2 rounded'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsContainer;
