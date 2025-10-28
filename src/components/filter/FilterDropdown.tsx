'use client';

import { CustomDropdown } from '../ui/CustomDropdown';
import { FilterDropdownProps } from '@/types/filter.types';

export const FilterDropdown = ({
  label,
  icon,
  options,
  value,
  onChange,
  placeholder,
}: FilterDropdownProps) => {
  return (
    <div>
      <label className='block text-sm font-bold text-yellow-300 mb-2'>
        {icon} {label}
      </label>
      <CustomDropdown
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};
