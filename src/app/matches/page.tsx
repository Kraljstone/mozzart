'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMatches } from '@/hooks/useMatches';
import { MatchFilters } from '@/components/MatchFilters';
import { Header } from '@/components/Header';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { NoMatches } from '@/components/NoMatches';
import { MatchesSection } from '@/components/MatchesSection';
import { FavoritesProvider, useFavorites } from '@/contexts/FavoritesContext';
import { MatchFilters as FilterType } from '@/types/match.types';
import { authService } from '@/services/auth';

const MainContent = () => {
  const router = useRouter();
  const [validatedUsername, setValidatedUsername] = useState('');
  const [filters, setFilters] = useState<FilterType>({});
  const [isConnected, setIsConnected] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { isFavorite } = useFavorites();

  // Handle hydration safely
  useLayoutEffect(() => {
    const initializeAuth = () => {
      setIsMounted(true);

      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setValidatedUsername(currentUser.username);
      }
    };

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
      setIsConnected(Math.random() > 0.05);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setValidatedUsername('');
    router.push('/login');
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
    <div className='min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800'>
      <Header
        isConnected={isConnected}
        lastUpdated={lastUpdated ? new Date(lastUpdated).getTime() : undefined}
        onRefresh={retry}
        onLogout={handleLogout}
      />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <MatchFilters
          filters={filters}
          onFiltersChange={setFilters}
          availableLeagues={availableLeagues}
        />

        {error && <ErrorState error={error} onRetry={retry} />}

        {loading && matches.length === 0 && <LoadingState />}

        {!loading && filteredMatches.length === 0 && matches.length === 0 && (
          <NoMatches hasError={!!error} />
        )}

        {filteredMatches.length > 0 && (
          <MatchesSection
            matches={filteredMatches}
            newMatches={newMatches}
            removedMatches={removedMatches}
          />
        )}

        {loading && matches.length > 0 && <LoadingState isUpdating />}
      </main>
    </div>
  );
};

export default function MatchesPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      if (!authService.isLoggedIn()) {
        router.push('/login');
      } else {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // Always show loading initially to prevent hydration mismatch
  if (isCheckingAuth) {
    return (
      <div className='min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <div className='text-yellow-400 text-xl font-bold'>
            🎰 Loading Mozzart Sports 🎰
          </div>
        </div>
      </div>
    );
  }

  return (
    <FavoritesProvider>
      <MainContent />
    </FavoritesProvider>
  );
}
