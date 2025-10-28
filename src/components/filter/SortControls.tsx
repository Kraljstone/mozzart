'use client';

import { SortAsc, SortDesc } from 'lucide-react';
import { CustomDropdown } from '../ui/CustomDropdown';
import { SortControlsProps } from '@/types/filter.types';

export const SortControls = ({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  sortByOptions,
}: SortControlsProps) => {
  return (
    <>
      {/* Sort By */}
      <div>
        <label className='block text-sm font-bold text-yellow-300 mb-2'>
          🔄 Sort By
        </label>
        <CustomDropdown
          options={sortByOptions}
          value={sortBy}
          onChange={onSortByChange}
          placeholder='Default'
        />
      </div>

      {/* Sort Order */}
      <div>
        <label className='block text-sm font-bold text-yellow-300 mb-2'>
          📊 Order
        </label>
        <div className='flex gap-2'>
          <button
            onClick={() => onSortOrderChange('asc')}
            className={`flex items-center gap-1 px-3 py-2 text-sm border rounded-lg transition-all duration-300 hover:cursor-pointer ${
              sortOrder === 'asc'
                ? 'bg-linear-to-br from-yellow-500 to-red-600 text-white border-yellow-500 shadow-lg'
                : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
            }`}
          >
            <SortAsc className='w-4 h-4' />
            Asc
          </button>
          <button
            onClick={() => onSortOrderChange('desc')}
            className={`flex items-center gap-1 px-3 py-2 text-sm border rounded-lg transition-all duration-300 hover:cursor-pointer ${
              sortOrder === 'desc'
                ? 'bg-linear-to-br from-yellow-500 to-red-600 text-white border-yellow-500 shadow-lg'
                : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
            }`}
          >
            <SortDesc className='w-4 h-4' />
            Desc
          </button>
        </div>
      </div>
    </>
  );
};
