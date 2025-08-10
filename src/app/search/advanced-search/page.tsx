'use server';
import { getUserCollections } from '@/app/utils/mongoDB';
import {
  getAllRarities,
  getSetAndSeriesNames,
  sortAndGroupSets,
  transformRarities,
  getAllSets,
} from '@/app/utils/tcgClient';
import AdvancedSearchContainer from '@/components/AdvancedSearchContainer/AdvancedSearchContainer';
import { currentUser } from '@clerk/nextjs/server';

const Page = async () => {
  const user = await currentUser();
  const collections = user?.id ? await getUserCollections(user.id) : [];
  let initialSet: unknown = [];
  try {
    // May intermittently fail due to upstream API instability
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - allow empty fallback when API fails
    initialSet = await getAllSets();
  } catch {
    initialSet = [] as never[];
  }
  const sortedSets = sortAndGroupSets(initialSet as never);
  const { setNames, seriesNames } = getSetAndSeriesNames(sortedSets);
  let rarities: string[] = [];
  try {
    // Same as above: fail gracefully
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rarities = await getAllRarities();
  } catch {
    rarities = [];
  }
  const rarityObj = transformRarities(rarities as never);

  return (
    <AdvancedSearchContainer
      collections={collections}
      setNames={setNames}
      seriesNames={seriesNames}
      rarities={rarityObj}
    />
  );
};

export default Page;
