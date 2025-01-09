'use client';
import { energyJSON } from '@/constants/energy';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  energies: {
    name: string;
    checked: boolean;
  }[];
  setEnergies: Dispatch<
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

const EnergyCheckboxes = ({ energies, setEnergies, handleCheck }: Props) => {
  return (
    <>
      {energyJSON.map((item, index) => (
        <div key={`${item.name}-${index}`} className='flex items-center mb-4'>
          <input
            id={`${item.name}-checkbox`}
            type='checkbox'
            value={item.name}
            checked={
              energies.find((energy) => energy.name === item.name)?.checked
            }
            className='capitalize w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            onChange={(e) => handleCheck(energies, setEnergies, e)}
          />
          <label
            htmlFor={`${item.name}-checkbox`}
            className='flex ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
          >
            <Image src={item.image} alt={item.name} width={20} height={20} />
            <span className='pl-3'>{item.name}</span>
          </label>
        </div>
      ))}
    </>
  );
};

export default EnergyCheckboxes;
