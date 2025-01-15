'use server';
import { getUserCollections } from '@/app/utils/mongoDB';
import AdvancedSearchContainer from '@/components/AdvancedSearchContainer/AdvancedSearchContainer';
import { currentUser } from '@clerk/nextjs/server';

const Page = async () => {
  const user = await currentUser();
  const collections = user?.id ? await getUserCollections(user.id) : [];

  return (
    <AdvancedSearchContainer userID={user?.id} collections={collections} />
  );
};

export default Page;
