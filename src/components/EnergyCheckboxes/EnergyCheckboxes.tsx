'use client';
import { energyJSON } from '@/constants/energy';
import { inputProps } from '@/types/types';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  energies: inputProps[];
  setEnergies: Dispatch<SetStateAction<inputProps[]>>;
  handleCheck: (
    energyObj: inputProps[],
    objSetter: Dispatch<SetStateAction<inputProps[]>>,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  displayAsRow?: boolean;
  type?: string;
};

const EnergyCheckboxes = ({
  energies,
  setEnergies,
  handleCheck,
  displayAsRow = false,
  type = 'energy',
}: Props) => {
  return (
    <div className={`${displayAsRow ? 'flex flex-wrap' : ''}`}>
      {energyJSON.map((item, index) => (
        <div
          key={`${item.name}-${index}-${type}`}
          className={`flex items-center mb-4 ${
            displayAsRow ? 'mr-4 last-of-type:mr-0' : ''
          }`}
        >
          <input
            id={`${item.name}-checkbox-${type}`}
            type='checkbox'
            value={item.name}
            checked={
              energies.find((energy) => energy.name === item.name)?.checked
            }
            className='capitalize w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            onChange={(e) => handleCheck(energies, setEnergies, e)}
          />
          <label
            htmlFor={`${item.name}-checkbox-${type}`}
            className='flex ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
          >
            <Image src={item.image} alt={item.name} width={20} height={20} />
            <span className='pl-3'>{item.name}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default EnergyCheckboxes;
