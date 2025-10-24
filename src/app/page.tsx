'use client';

import { useState, useEffect } from 'react';
import { useMatches } from '@/hooks/useMatches';
import { MatchCard } from '@/components/MatchCard';
import { MatchFilters } from '@/components/MatchFilters';
import {
  ScrollProgressProvider,
  ScrollProgress,
  ScrollProgressContainer,
} from '@/components/ScrollProgress';
import { MatchFilters as FilterType, Match } from '@/types/match';
import { RefreshCw, AlertCircle, Wifi, WifiOff, LogOut } from 'lucide-react';
import { setCookie, getCookie, deleteCookie } from '@/utils/cookies';

export default function Home() {
  const [username, setUsername] = useState('');
  const [filters, setFilters] = useState<FilterType>({});
  const [isConnected, setIsConnected] = useState(false);

  const {
    matches,
    loading,
    error,
    lastUpdated,
    newMatches,
    removedMatches,
    retry,
  } = useMatches(username, filters);

  // Get unique leagues for filter dropdown
  const availableLeagues = Array.from(
    new Set(matches.map((match) => match.league))
  ).sort();

  // Load saved username from cookie on mount
  useEffect(() => {
    const savedUsername = getCookie('mozzart_username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  // Simulate connection status (in real app, this would come from socket)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% chance of being connected
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Save username to cookie for 1 day
      setCookie('mozzart_username', username.trim(), 1);
    }
  };

  const handleLogout = () => {
    deleteCookie('mozzart_username');
    setUsername('');
    setFilters({});
  };

  const filteredMatches = matches.filter((match: Match) => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        match.homeTeam.toLowerCase().includes(searchTerm) ||
        match.awayTeam.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  if (!username) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='max-w-md w-full bg-white rounded-lg shadow-md p-6'>
          <h1 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
            Mozzart Sports Matches
          </h1>
          <form onSubmit={handleUsernameSubmit} className='space-y-4'>
            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Enter your email address
              </label>
              <input
                type='email'
                id='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='your.email@example.com'
                className='w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
            >
              Start Watching Matches
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Live Sports Matches
              </h1>
              <p className='text-sm text-gray-600'>
                Welcome, {username} • {matches.length} matches
              </p>
            </div>

            <div className='flex items-center gap-4'>
              {/* Connection Status */}
              <div className='flex items-center gap-2'>
                {isConnected ? (
                  <Wifi className='w-5 h-5 text-green-500' />
                ) : (
                  <WifiOff className='w-5 h-5 text-red-500' />
                )}
                <span className='text-sm text-gray-600'>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              {/* Last Updated */}
              {lastUpdated && (
                <div className='text-sm text-gray-500'>
                  Updated: {new Date(lastUpdated).toLocaleTimeString()}
                </div>
              )}

              {/* Refresh Button */}
              <button
                onClick={retry}
                disabled={loading}
                className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors'
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                />
                Refresh
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors'
              >
                <LogOut className='w-4 h-4' />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        {/* Filters */}
        <MatchFilters
          filters={filters}
          onFiltersChange={setFilters}
          availableLeagues={availableLeagues}
        />

        {/* Error State */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-md p-4 mb-6'>
            <div className='flex items-center gap-2'>
              <AlertCircle className='w-5 h-5 text-red-500' />
              <div>
                <h3 className='text-sm font-medium text-red-800'>
                  Error loading matches
                </h3>
                <p className='text-sm text-red-700 mt-1'>{error}</p>
                <button
                  onClick={retry}
                  className='mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline'
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && matches.length === 0 && (
          <div className='text-center py-12'>
            <RefreshCw className='w-8 h-8 text-gray-400 animate-spin mx-auto mb-4' />
            <p className='text-gray-600'>Loading matches...</p>
          </div>
        )}

        {/* No Matches */}
        {!loading && filteredMatches.length === 0 && !error && (
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <svg
                className='w-16 h-16 mx-auto'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No matches found
            </h3>
            <p className='text-gray-600'>
              {filters.search || filters.league || filters.status
                ? 'Try adjusting your filters'
                : 'No matches are currently available'}
            </p>
          </div>
        )}

        {/* Matches Grid with Local Scroll Progress */}
        {filteredMatches.length > 0 && (
          <ScrollProgressProvider>
            <ScrollProgress
              mode='width'
              className='local-scroll-progress h-1'
            />
            <ScrollProgressContainer className='relative'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {filteredMatches.map((match: Match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    isNew={newMatches.has(match.id)}
                    isRemoved={removedMatches.has(match.id)}
                  />
                ))}
              </div>
            </ScrollProgressContainer>
          </ScrollProgressProvider>
        )}

        {/* Loading indicator for updates */}
        {loading && matches.length > 0 && (
          <div className='fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3'>
            <div className='flex items-center gap-2'>
              <RefreshCw className='w-4 h-4 text-blue-500 animate-spin' />
              <span className='text-sm text-gray-700'>Updating matches...</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
