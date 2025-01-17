import { getAllSets, sortAndGroupSets } from '@/app/utils/tcgClient';
import SetsContainer from '@/components/SetsContainer/SetsContainer';

const Page = async () => {
  const initialSet = await getAllSets();
  const sortedSets = sortAndGroupSets(initialSet);
  return <SetsContainer sets={sortedSets} />;
};

export default Page;
