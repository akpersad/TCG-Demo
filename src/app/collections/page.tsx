'use server';
import { currentUser } from '@clerk/nextjs/server';
import { getUserCollections } from '@/app/utils/mongoDB';
import { Collection, MongoDBCollectionNamespace, WithId } from 'mongodb';

const CollectionsPage = async () => {
  const user = await currentUser();
  const userCollections = await getUserCollections(user?.id || '');

  return (
    <div className='container mx-auto my-8'>
      <h1>Collections Page</h1>
      <p>My Collections:</p>
      <ol>
        {userCollections.map((collection) => (
          <li key={collection._id}>
            <h2>{collection.name}</h2>
            {collection.description && <p>{collection.description}</p>}
            <span>{collection._id.toString()}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default CollectionsPage;
