import { getAllSets } from '@/app/utils/tcgClient';
import SetsContainer from '@/components/SetsContainer/SetsContainer';
import { GroupedSet } from '@/types/types';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

const sortAndGroupSets = (sets: PokemonTCG.Set[]) => {
  const groupedSets: GroupedSet[] = [];
  sets.forEach((set) => {
    const existingGroup = groupedSets.find(
      (group) => group.series === set.series
    );
    if (existingGroup) {
      existingGroup.sets.push(set);
      if (set.releaseDate < existingGroup.earliestReleaseDate) {
        existingGroup.earliestReleaseDate = set.releaseDate;
      }
    } else {
      groupedSets.push({
        series: set.series,
        sets: [set],
        earliestReleaseDate: set.releaseDate,
      });
    }
  });

  groupedSets.forEach((group) => {
    group.sets.sort((a, b) => (a.releaseDate > b.releaseDate ? -1 : 1));
  });

  return groupedSets.sort((a, b) =>
    a.earliestReleaseDate > b.earliestReleaseDate ? -1 : 1
  );
};

const Page = async () => {
  const initialSet = await getAllSets();
  const sortedSets = sortAndGroupSets(initialSet);
  console.log('🚀 ~ Page ~ sortedSets:', sortedSets);
  return <SetsContainer sets={sortedSets} />;
};

export default Page;
