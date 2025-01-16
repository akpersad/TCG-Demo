import { Dispatch, SetStateAction } from 'react';

type Props = {
  subtypesForSearch: {
    name: string;
    checked: boolean;
  }[];
  setSubtypesForSearch: Dispatch<
    SetStateAction<
      {
        name: string;
        checked: boolean;
      }[]
    >
  >;
  searchSubtypes: string[];
  setSearchSubtypes: Dispatch<SetStateAction<string[]>>;
  handleCheckForMultiSelect: (
    searchJSONObj: {
      name: string;
      checked: boolean;
    }[],
    searchJSONSetter: Dispatch<
      SetStateAction<
        {
          name: string;
          checked: boolean;
        }[]
      >
    >,
    stringSetter: Dispatch<SetStateAction<string[]>>,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
};

const SubtypesMultiselect = ({
  subtypesForSearch,
  setSubtypesForSearch,
  searchSubtypes,
  setSearchSubtypes,
  handleCheckForMultiSelect,
}: Props) => {
  return (
    <div>
      <label
        htmlFor='subtype_multiple'
        className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
      >
        Select Card Types
      </label>
      <select
        multiple
        id='subtype_multiple'
        size={6}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        value={searchSubtypes}
        onChange={(e) =>
          handleCheckForMultiSelect(
            subtypesForSearch,
            setSubtypesForSearch,
            setSearchSubtypes,
            e
          )
        }
      >
        {subtypesForSearch.map((subtype) => (
          <option
            key={`search-subtype-advanced-${subtype.name}`}
            value={subtype.name}
          >
            {subtype.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SubtypesMultiselect;
