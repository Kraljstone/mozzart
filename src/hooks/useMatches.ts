'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Match, MatchState, MatchFilters } from '@/types/match';
import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const useMatches = (username: string, filters: MatchFilters = {}) => {
  const [state, setState] = useState<MatchState>({
    matches: [],
    loading: true,
    error: null,
    lastUpdated: null,
    newMatches: new Set(),
    removedMatches: new Set(),
  });

  const socketRef = useRef<Socket | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const fetchMatches = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const params = new URLSearchParams({
        username: decodeURIComponent(username),
      });
      if (filters.league) params.append('league', filters.league);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await fetch(`/api/matches?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const newMatches = Array.isArray(data) ? data : data.matches || [];

      setState((prev) => {
        const currentMatchIds = new Set(prev.matches.map((m) => m.id));
        const newMatchIds = new Set(newMatches.map((m: Match) => m.id));

        // Find new matches
        const addedMatches = new Set<string>(
          [...newMatchIds].filter(
            (id): id is string =>
              typeof id === 'string' && !currentMatchIds.has(id)
          )
        );
        // Find removed matches
        const removedMatches = new Set(
          [...currentMatchIds].filter((id) => !newMatchIds.has(id))
        );

        return {
          ...prev,
          matches: newMatches,
          loading: false,
          error: null,
          lastUpdated: new Date().toISOString(),
          newMatches: addedMatches,
          removedMatches: removedMatches,
        };
      });

      // Clear new/removed match indicators after 1 second
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          newMatches: new Set(),
          removedMatches: new Set(),
        }));
      }, 1000);

      retryCountRef.current = 0;
    } catch (error: unknown) {
      console.error('Error fetching matches:', error);

      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));

      // Implement retry mechanism
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        const retryDelay = Math.pow(2, retryCountRef.current) * 1000;

        retryTimeoutRef.current = setTimeout(() => {
          fetchMatches();
        }, retryDelay);
      }
    }
  }, [username, filters]);

  const connectSocket = useCallback(() => {
    if (socketRef.current?.connected) return;

    socketRef.current = io(API_BASE_URL, {
      auth: { username },
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      setState((prev) => ({ ...prev, error: null }));
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketRef.current.on('matchUpdate', (data: { matches: Match[] }) => {
      setState((prev) => {
        const currentMatchIds = new Set(prev.matches.map((m) => m.id));
        const newMatchIds = new Set(data.matches.map((m) => m.id));

        const addedMatches = new Set<string>(
          [...newMatchIds].filter(
            (id): id is string =>
              typeof id === 'string' && !currentMatchIds.has(id)
          )
        );
        const removedMatches = new Set(
          [...currentMatchIds].filter(
            (id): id is string => typeof id === 'string' && !newMatchIds.has(id)
          )
        );

        return {
          ...prev,
          matches: data.matches,
          lastUpdated: new Date().toISOString(),
          newMatches: addedMatches,
          removedMatches: removedMatches,
        };
      });

      // Clear indicators after 1 second
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          newMatches: new Set(),
          removedMatches: new Set(),
        }));
      }, 1000);
    });

    socketRef.current.on('error', (error: unknown) => {
      console.error('Socket error:', error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Socket error',
      }));
    });
  }, [username]);

  useEffect(() => {
    if (!username) return;

    // Initial fetch
    fetchMatches();

    // Set up polling as fallback (every 7 seconds)
    const pollInterval = setInterval(fetchMatches, 700000);

    // Try to connect to socket for real-time updates
    connectSocket();

    return () => {
      clearInterval(pollInterval);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [username, fetchMatches, connectSocket]);

  const retry = useCallback(() => {
    retryCountRef.current = 0;
    fetchMatches();
  }, [fetchMatches]);

  return {
    ...state,
    retry,
  };
};
