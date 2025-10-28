'use client';

import { FilterDropdown } from './FilterDropdown';
import { SortControls } from './SortControls';
import { FiltersGridProps } from '@/types/filter.types';

export const FiltersGrid = ({
  filters,
  onFilterChange,
  leagueOptions,
  competitionOptions,
  venueOptions,
  statusOptions,
  sortByOptions,
}: FiltersGridProps) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
      {/* League Filter */}
      <FilterDropdown
        label='League'
        icon='🏆'
        options={leagueOptions}
        value={filters.league || ''}
        onChange={(value) => onFilterChange('league', value)}
        placeholder='All Leagues'
      />

      {/* Competition Filter */}
      <FilterDropdown
        label='Competition'
        icon='🏟️'
        options={competitionOptions}
        value={filters.competition || ''}
        onChange={(value) => onFilterChange('competition', value)}
        placeholder='All Competitions'
      />

      {/* Venue Filter */}
      <FilterDropdown
        label='Venue'
        icon='📍'
        options={venueOptions}
        value={filters.venue || ''}
        onChange={(value) => onFilterChange('venue', value)}
        placeholder='All Venues'
      />

      {/* Status Filter */}
      <FilterDropdown
        label='Status'
        icon='⚡'
        options={statusOptions}
        value={filters.status || ''}
        onChange={(value) => onFilterChange('status', value)}
        placeholder='All Status'
      />

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
            onChange={(e) => onFilterChange('favoritesOnly', e.target.checked)}
            className='w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500 focus:ring-2'
          />
          <label htmlFor='favoritesOnly' className='text-sm text-gray-300'>
            Show favorites only
          </label>
        </div>
      </div>

      {/* Sort Controls */}
      <SortControls
        sortBy={filters.sortBy || ''}
        sortOrder={filters.sortOrder || ''}
        onSortByChange={(value) => onFilterChange('sortBy', value)}
        onSortOrderChange={(value) => onFilterChange('sortOrder', value)}
        sortByOptions={sortByOptions}
      />
    </div>
  );
};
