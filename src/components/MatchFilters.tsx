'use client';

import { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { MatchFiltersProps } from '@/types/match.types';

export const MatchFilters = ({
  filters,
  onFiltersChange,
  availableLeagues,
}: MatchFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (
    key: keyof MatchFiltersProps,
    value: string | boolean
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className='relative bg-linear-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-6 shadow-2xl before:absolute before:inset-0 before:rounded-xl before:p-[2px] before:bg-linear-to-r before:from-yellow-500 before:via-red-500 before:to-pink-500 before:-z-10'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-xl font-bold bg-linear-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent'>
          🎰 FILTERS & SEARCH 🎰
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='flex items-center gap-2 px-4 py-2 text-sm font-bold hover:cursor-pointer text-white bg-linear-to-br from-yellow-500 to-red-600 rounded-lg hover:from-yellow-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25'
        >
          <Filter className='w-4 h-4' />
          {isExpanded ? '🎲 Hide' : '🎰 Show'} Filters
        </button>
      </div>

      {/* Search bar - always visible */}
      <div className='relative mb-4'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400' />
        <input
          type='text'
          placeholder='Search by team name...'
          value={filters.search || ''}
          onChange={(e) =>
            handleFilterChange(
              'search' as keyof MatchFiltersProps,
              e.target.value
            )
          }
          className='w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300'
        />
      </div>

      {isExpanded && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* League Filter */}
          <div>
            <label className='block text-sm font-bold text-yellow-300 mb-2'>
              🏆 League
            </label>
            <select
              value={filters.league || ''}
              onChange={(e) =>
                handleFilterChange(
                  'league' as keyof MatchFiltersProps,
                  e.target.value
                )
              }
              className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300'
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
            <label className='block text-sm font-bold text-yellow-300 mb-2'>
              ⚡ Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) =>
                handleFilterChange(
                  'status' as keyof MatchFiltersProps,
                  e.target.value
                )
              }
              className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300'
            >
              <option value=''>All Status</option>
              <option value='upcoming'>Upcoming</option>
              <option value='live'>Live</option>
              <option value='finished'>Finished</option>
            </select>
          </div>

          {/* Favorites Filter */}
          <div>
            <label className='block text-sm font-bold text-yellow-300 mb-2'>
              ❤️ Favorites
            </label>
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='favoritesOnly'
                checked={filters.favoritesOnly || false}
                onChange={(e) =>
                  handleFilterChange(
                    'favoritesOnly' as keyof MatchFiltersProps,
                    e.target.checked
                  )
                }
                className='w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500 focus:ring-2'
              />
              <label htmlFor='favoritesOnly' className='text-sm text-gray-300'>
                Show favorites only
              </label>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className='block text-sm font-bold text-yellow-300 mb-2'>
              🔄 Sort By
            </label>
            <select
              value={filters.sortBy || ''}
              onChange={(e) =>
                handleFilterChange(
                  'sortBy' as keyof MatchFiltersProps,
                  e.target.value
                )
              }
              className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300'
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
            <label className='block text-sm font-bold text-yellow-300 mb-2'>
              📊 Order
            </label>
            <div className='flex gap-2'>
              <button
                onClick={() =>
                  handleFilterChange(
                    'sortOrder' as keyof MatchFiltersProps,
                    'asc'
                  )
                }
                className={`flex items-center gap-1 px-3 py-2 text-sm border rounded-lg transition-all duration-300 hover:cursor-pointer ${
                  filters.sortOrder === 'asc'
                    ? 'bg-linear-to-br from-yellow-500 to-red-600 text-white border-yellow-500 shadow-lg'
                    : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                }`}
              >
                <SortAsc className='w-4 h-4' />
                Asc
              </button>
              <button
                onClick={() =>
                  handleFilterChange(
                    'sortOrder' as keyof MatchFiltersProps,
                    'desc'
                  )
                }
                className={`flex items-center gap-1 px-3 py-2 text-sm border rounded-lg transition-all duration-300 hover:cursor-pointer ${
                  filters.sortOrder === 'desc'
                    ? 'bg-linear-to-br from-yellow-500 to-red-600 text-white border-yellow-500 shadow-lg'
                    : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
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
          className='px-4 py-2 text-sm font-bold hover:cursor-pointer text-white bg-linear-to-br from-red-500 to-pink-600 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25'
        >
          🗑️ Clear All Filters
        </button>
      </div>
    </div>
  );
};
