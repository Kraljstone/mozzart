'use client';

import { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { MatchFiltersProps } from '@/types/match.types';
import { CustomDropdown } from './CustomDropdown';

export const MatchFilters = ({
  filters,
  onFiltersChange,
  availableLeagues,
  availableCompetitions,
  availableVenues,
  availableStatuses,
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

  // Dropdown options - dynamically generated from API data
  const leagueOptions = [
    { value: '', label: 'All Leagues' },
    ...availableLeagues.map((league) => ({ value: league, label: league })),
  ];

  const competitionOptions = [
    { value: '', label: 'All Competitions' },
    ...availableCompetitions.map((competition) => ({
      value: competition,
      label: competition,
    })),
  ];

  const venueOptions = [
    { value: '', label: 'All Venues' },
    ...availableVenues.map((venue) => ({ value: venue, label: venue })),
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    ...availableStatuses.map((status) => ({
      value: status,
      label: status.charAt(0).toUpperCase() + status.slice(1),
    })),
  ];

  const sortByOptions = [
    { value: '', label: 'Default' },
    { value: 'time', label: 'Time' },
    { value: 'league', label: 'League' },
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'result', label: 'Result' },
  ];

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
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
          {/* League Filter */}
          <div>
            <label className='block text-sm font-bold text-yellow-300 mb-2'>
              🏆 League
            </label>
            <CustomDropdown
              options={leagueOptions}
              value={filters.league || ''}
              onChange={(value) =>
                handleFilterChange('league' as keyof MatchFiltersProps, value)
              }
              placeholder='All Leagues'
            />
          </div>

          {/* Competition Filter */}
          <div>
            <label className='block text-sm font-bold text-yellow-300 mb-2'>
              🏟️ Competition
            </label>
            <CustomDropdown
              options={competitionOptions}
              value={filters.competition || ''}
              onChange={(value) =>
                handleFilterChange(
                  'competition' as keyof MatchFiltersProps,
                  value
                )
              }
              placeholder='All Competitions'
            />
          </div>

          {/* Venue Filter */}
          <div>
            <label className='block text-sm font-bold text-yellow-300 mb-2'>
              📍 Venue
            </label>
            <CustomDropdown
              options={venueOptions}
              value={filters.venue || ''}
              onChange={(value) =>
                handleFilterChange('venue' as keyof MatchFiltersProps, value)
              }
              placeholder='All Venues'
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className='block text-sm font-bold text-yellow-300 mb-2'>
              ⚡ Status
            </label>
            <CustomDropdown
              options={statusOptions}
              value={filters.status || ''}
              onChange={(value) =>
                handleFilterChange('status' as keyof MatchFiltersProps, value)
              }
              placeholder='All Status'
            />
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
            <CustomDropdown
              options={sortByOptions}
              value={filters.sortBy || ''}
              onChange={(value) =>
                handleFilterChange('sortBy' as keyof MatchFiltersProps, value)
              }
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
