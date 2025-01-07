'use client';
import { subtypes as SUBTYPES_JSON } from '@/constants/subtypes';
import { Dispatch, SetStateAction, useMemo } from 'react';

type Props = {
  advancedSearch?: boolean;
  searchSubtypes: {
    name: string;
    checked: boolean;
  }[];
  setSearchSubtypes: Dispatch<
    SetStateAction<
      {
        name: string;
        checked: boolean;
      }[]
    >
  >;
  handleCheck: (
    energyObj: {
      name: string;
      checked: boolean;
    }[],
    objSetter: Dispatch<
      SetStateAction<
        {
          name: string;
          checked: boolean;
        }[]
      >
    >,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
};
// interface SubtypesCheckboxesProps {
//     subtypes: string[];
//     selectedSubtypes: string[];
//     onSubtypeChange: (subtype: string) => void;
// }

const SubtypesCheckboxes = ({
  advancedSearch = false,
  searchSubtypes,
  setSearchSubtypes,
  handleCheck,
}: Props) => {
  const handleAdvancedToggle = useMemo(() => {
    const simpleSearchElements = ['GX', 'EX', 'MEGA', 'V', 'VMAX'];

    if (advancedSearch) {
      return SUBTYPES_JSON;
    }
    return SUBTYPES_JSON.filter((subtype) =>
      simpleSearchElements.includes(subtype.name)
    );
  }, [advancedSearch]);
  return (
    <>
      {!advancedSearch &&
        handleAdvancedToggle.map((item, index) => (
          <div key={`${item.name}-${index}`} className='flex items-center mb-4'>
            <input
              id={`${item.name}-checkbox`}
              type='checkbox'
              value={item.name}
              className='capitalize w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
              onChange={(e) =>
                handleCheck(searchSubtypes, setSearchSubtypes, e)
              }
            />
            <label
              htmlFor={`${item.name}-checkbox`}
              className='flex ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
            >
              <span className='pl-3'>{item.name}</span>
            </label>
          </div>
        ))}
    </>
  );
};

export default SubtypesCheckboxes;
