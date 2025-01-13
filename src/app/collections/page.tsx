'use server';
import { currentUser } from '@clerk/nextjs/server';
import { getUserCollections } from '@/app/utils/mongoDB';
import CollectionsContainer from '@/components/CollectionsContainer/CollectionsContainer';

const CollectionsPage = async () => {
  const user = await currentUser();
  const userCollections = await getUserCollections(user?.id || '');

  return (
    <CollectionsContainer
      userCollections={userCollections}
      userID={user?.id.toString() || ''}
    />
  );
};

export default CollectionsPage;
