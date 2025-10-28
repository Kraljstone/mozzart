'use client';

import { Search } from 'lucide-react';
import { SearchBarProps } from '@/types/filter.types';

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search by team name...',
}: SearchBarProps) => {
  return (
    <div className='relative mb-4'>
      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400' />
      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300'
      />
    </div>
  );
};
