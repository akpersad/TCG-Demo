'use server';
import { getUserCollections } from '@/app/utils/mongoDB';
import { getSetAndSeriesNames, sortAndGroupSets } from '@/app/utils/tcgClient';
import AdvancedSearchContainer from '@/components/AdvancedSearchContainer/AdvancedSearchContainer';
import { currentUser } from '@clerk/nextjs/server';
import { getAllSets } from 'pokemon-tcg-sdk-typescript/dist/sdk';

const Page = async () => {
  const user = await currentUser();
  const collections = user?.id ? await getUserCollections(user.id) : [];
  const initialSet = await getAllSets();
  const sortedSets = sortAndGroupSets(initialSet);
  const { setNames, seriesNames } = getSetAndSeriesNames(sortedSets);

  return (
    <AdvancedSearchContainer
      userID={user?.id}
      collections={collections}
      setNames={setNames}
      seriesNames={seriesNames}
    />
  );
};

export default Page;
