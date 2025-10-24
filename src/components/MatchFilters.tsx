'use client';

import { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { MatchFilters as FilterType } from '@/types/match';

interface MatchFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  availableLeagues: string[];
}

export const MatchFilters = ({
  filters,
  onFiltersChange,
  availableLeagues,
}: MatchFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof FilterType, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className='bg-white rounded-lg border border-gray-200 p-4 mb-6'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Filters & Search
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'
        >
          <Filter className='w-4 h-4' />
          {isExpanded ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {/* Search bar - always visible */}
      <div className='relative mb-4'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
        <input
          type='text'
          placeholder='Search by team name...'
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className='w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        />
      </div>

      {isExpanded && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* League Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              League
            </label>
            <select
              value={filters.league || ''}
              onChange={(e) => handleFilterChange('league', e.target.value)}
              className='w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            >
              <option value=''>All Leagues</option>
              {availableLeagues.map((league) => (
                <option key={league} value={league}>
                  {league}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className='w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            >
              <option value=''>All Status</option>
              <option value='upcoming'>Upcoming</option>
              <option value='live'>Live</option>
              <option value='finished'>Finished</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Sort By
            </label>
            <select
              value={filters.sortBy || ''}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className='w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            >
              <option value=''>Default</option>
              <option value='time'>Time</option>
              <option value='league'>League</option>
              <option value='alphabetical'>Alphabetical</option>
              <option value='result'>Result</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Order
            </label>
            <div className='flex gap-2'>
              <button
                onClick={() => handleFilterChange('sortOrder', 'asc')}
                className={`flex items-center gap-1 px-3 py-2 text-sm border rounded-md transition-colors ${
                  filters.sortOrder === 'asc'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <SortAsc className='w-4 h-4' />
                Asc
              </button>
              <button
                onClick={() => handleFilterChange('sortOrder', 'desc')}
                className={`flex items-center gap-1 px-3 py-2 text-sm border rounded-md transition-colors ${
                  filters.sortOrder === 'desc'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <SortDesc className='w-4 h-4' />
                Desc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Filters */}
      <div className='flex justify-end mt-4'>
        <button
          onClick={clearFilters}
          className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};
