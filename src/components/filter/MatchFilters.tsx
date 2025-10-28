'use client';

import { useState, useEffect, useRef } from 'react';
import { Filter } from 'lucide-react';
import { MatchFiltersProps } from '@/types/match.types';
import { FilterValues } from '@/types/filter.types';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchBar } from './SearchBar';
import { FiltersGrid } from './FiltersGrid';

export const MatchFilters = ({
  filters,
  onFiltersChange,
  availableLeagues,
  availableCompetitions,
  availableVenues,
  availableStatuses,
}: MatchFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 300);
  const prevDebouncedSearch = useRef(debouncedSearch);
  const filtersRef = useRef(filters);

  // Keep filters ref up to date
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Update search filter when debounced search changes
  useEffect(() => {
    // Only update if the search value has actually changed
    if (prevDebouncedSearch.current !== debouncedSearch) {
      prevDebouncedSearch.current = debouncedSearch;
      // Update only the search property
      const newFilters = { ...filtersRef.current };
      if (debouncedSearch) {
        newFilters.search = debouncedSearch;
      } else {
        delete newFilters.search;
      }
      onFiltersChange(newFilters);
    }
  }, [debouncedSearch, onFiltersChange]);

  const handleFilterChange = (
    key: keyof FilterValues,
    value: FilterValues[keyof FilterValues]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    setSearchInput('');
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
      <SearchBar
        value={searchInput}
        onChange={setSearchInput}
        placeholder='Search by team name...'
      />

      {isExpanded && (
        <FiltersGrid
          filters={filters as FilterValues}
          onFilterChange={handleFilterChange}
          leagueOptions={leagueOptions}
          competitionOptions={competitionOptions}
          venueOptions={venueOptions}
          statusOptions={statusOptions}
          sortByOptions={sortByOptions}
        />
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
