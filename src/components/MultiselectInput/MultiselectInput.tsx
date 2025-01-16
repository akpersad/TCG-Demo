import { Dispatch, SetStateAction } from 'react';

type Props = {
  objectForSearch: {
    name: string;
    checked: boolean;
    id?: string;
  }[];
  setObjectForSearch: Dispatch<
    SetStateAction<
      | {
          name: string;
          checked: boolean;
        }[]
      | {
          name: string;
          checked: boolean;
          id: string;
        }[]
    >
  >;
  searchStrings: string[];
  setSearchStrings: Dispatch<SetStateAction<string[]>>;
  handleCheckForMultiSelect: (
    searchJSONObj: {
      name: string;
      checked: boolean;
      id?: string;
    }[],
    searchJSONSetter: Dispatch<
      SetStateAction<
        {
          name: string;
          checked: boolean;
          id?: string;
        }[]
      >
    >,
    stringSetter: Dispatch<SetStateAction<string[]>>,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  title: string;
  linesToShow?: number;
};

const MultiselectInput = ({
  objectForSearch,
  setObjectForSearch,
  searchStrings,
  setSearchStrings,
  handleCheckForMultiSelect,
  title,
  linesToShow = 6,
}: Props) => {
  return (
    <div>
      <label
        htmlFor='subtype_multiple'
        className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
      >
        {title}
      </label>
      <select
        multiple
        id='subtype_multiple'
        size={linesToShow}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        value={searchStrings}
        onChange={(e) =>
          handleCheckForMultiSelect(
            objectForSearch,
            setObjectForSearch,
            setSearchStrings,
            e
          )
        }
      >
        {objectForSearch.map((object) => (
          <option
            key={`search-subtype-advanced-${object.name}`}
            value={object.name}
          >
            {object.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MultiselectInput;
