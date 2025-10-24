'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import { useMatches } from '@/hooks/useMatches';
import { MatchFilters } from '@/components/MatchFilters';
import { VirtualizedMatchList } from '@/components/VirtualizedMatchList';
import {
  ScrollProgressProvider,
  ScrollProgress,
  ScrollProgressContainer,
} from '@/components/ScrollProgress';
import { FavoritesProvider, useFavorites } from '@/contexts/FavoritesContext';
import { MatchFilters as FilterType } from '@/types/match';
import { RefreshCw, AlertCircle, Wifi, WifiOff, LogOut } from 'lucide-react';

// Main content component that uses favorites
const MainContent = () => {
  const [validatedUsername, setValidatedUsername] = useState('');
  const [filters, setFilters] = useState<FilterType>({});
  const [isConnected, setIsConnected] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { isFavorite } = useFavorites();

  // Handle hydration safely
  useLayoutEffect(() => {
    const initializeAuth = () => {
      setIsMounted(true);

      const savedUsername = localStorage.getItem('mozzart_username');
      const savedTimestamp = localStorage.getItem('mozzart_username_timestamp');

      if (savedUsername && savedTimestamp) {
        const now = Date.now();
        const savedTime = parseInt(savedTimestamp);
        const oneDayInMs = 24 * 60 * 60 * 1000; // 1 day in milliseconds

        // Check if saved data is less than 1 day old
        if (now - savedTime < oneDayInMs) {
          setValidatedUsername(savedUsername);
        } else {
          // Clear expired data
          localStorage.removeItem('mozzart_username');
          localStorage.removeItem('mozzart_username_timestamp');
        }
      }
    };

    // Use requestAnimationFrame to defer state updates
    const rafId = requestAnimationFrame(initializeAuth);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const {
    matches,
    loading,
    error,
    lastUpdated,
    newMatches,
    removedMatches,
    retry,
  } = useMatches(validatedUsername, filters);

  // Get unique leagues for filter dropdown
  const availableLeagues = Array.from(
    new Set(matches.map((match) => match.league))
  ).sort();

  // Listen for login events
  useEffect(() => {
    const handleLogin = (event: CustomEvent) => {
      const username = event.detail?.username;
      if (username) {
        setValidatedUsername(username);
      }
    };

    window.addEventListener('mozzart-login', handleLogin as EventListener);
    return () =>
      window.removeEventListener('mozzart-login', handleLogin as EventListener);
  }, []);

  // Simulate connection status (in real app, this would come from socket)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional disconnections for demo purposes
      setIsConnected(Math.random() > 0.05); // 95% chance of being connected
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mozzart_username');
    localStorage.removeItem('mozzart_username_timestamp');
    setValidatedUsername('');

    // Dispatch custom logout event
    window.dispatchEvent(new CustomEvent('mozzart-logout'));
  };

  // Filter matches based on current filters
  const filteredMatches = matches.filter((match) => {
    const leagueMatch = !filters.league || match.league === filters.league;
    const statusMatch = !filters.status || match.status === filters.status;
    const searchMatch =
      !filters.search ||
      match.homeTeam.toLowerCase().includes(filters.search.toLowerCase()) ||
      match.awayTeam.toLowerCase().includes(filters.search.toLowerCase());
    const favoritesMatch = !filters.favoritesOnly || isFavorite(match.id);

    return leagueMatch && statusMatch && searchMatch && favoritesMatch;
  });

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return null;
  }

  // If user is not logged in, don't show main content
  if (!validatedUsername) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800'>
      {/* Header */}
      <header className='bg-gradient-to-r from-gray-800 to-gray-900 shadow-2xl border-b border-yellow-500/30'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div>
              <h1 className='text-2xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent'>
                🎰 LIVE SPORTS MATCHES 🎰
              </h1>
              <div className='flex items-center gap-4 mt-2'>
                <div className='flex items-center gap-2'>
                  {isConnected ? (
                    <Wifi className='w-4 h-4 text-green-400' />
                  ) : (
                    <WifiOff className='w-4 h-4 text-red-400' />
                  )}
                  <span className='text-gray-300 text-sm'>
                    {isConnected ? 'Live Updates' : 'Polling Mode'}
                  </span>
                </div>
                {lastUpdated && (
                  <span className='text-gray-300 text-sm'>
                    Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={retry}
                className='bg-gradient-to-r from-blue-500 to-blue-600
                 hover:cursor-pointer text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2'
              >
                <RefreshCw className='w-4 h-4' />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className='bg-gradient-to-r from-red-500 to-red-600
                 hover:cursor-pointer text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2'
              >
                <LogOut className='w-4 h-4' />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Filters */}
        <MatchFilters
          filters={filters}
          onFiltersChange={setFilters}
          availableLeagues={availableLeagues}
        />

        {/* Error State */}
        {error && (
          <div className='bg-red-900/50 border border-red-500 rounded-lg p-6 mb-6'>
            <div className='flex items-center gap-3'>
              <AlertCircle className='w-6 h-6 text-red-400' />
              <div>
                <h3 className='text-red-400 font-bold'>Connection Error</h3>
                <p className='text-red-300'>{error}</p>
                <button
                  onClick={retry}
                  className='mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors'
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && matches.length === 0 && (
          <div className='text-center py-12'>
            <div className='w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-yellow-400 text-lg font-bold'>
              🎰 Loading matches... 🎰
            </p>
          </div>
        )}

        {/* No Matches State */}
        {!loading && filteredMatches.length === 0 && matches.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-6xl mb-4'>🎲</div>
            <h2 className='text-2xl font-bold text-gray-300 mb-2'>
              No Matches Found
            </h2>
            <p className='text-gray-400'>
              {error
                ? 'Unable to load matches. Please try again.'
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
              <VirtualizedMatchList
                matches={filteredMatches}
                newMatches={newMatches}
                removedMatches={removedMatches}
                height={700}
              />
            </ScrollProgressContainer>
          </ScrollProgressProvider>
        )}

        {/* Loading indicator for updates */}
        {loading && matches.length > 0 && (
          <div className='fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3'>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
              <span className='text-sm text-gray-700'>Updating matches...</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Main page component with FavoritesProvider
export default function MainPage() {
  return (
    <FavoritesProvider>
      <MainContent />
    </FavoritesProvider>
  );
}
