'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Match, MatchState, MatchFilters } from '@/types/match.types';
import { io, Socket } from 'socket.io-client';
import { apiService } from '@/services/api';

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

  // Handle clearing indicators without setTimeout
  useEffect(() => {
    if (state.clearIndicatorsAt) {
      const now = Date.now();
      const timeUntilClear = state.clearIndicatorsAt - now;

      if (timeUntilClear > 0) {
        let animationId: number;

        const checkTime = () => {
          if (Date.now() >= state.clearIndicatorsAt!) {
            setState((prev) => ({
              ...prev,
              newMatches: new Set(),
              removedMatches: new Set(),
              clearIndicatorsAt: undefined,
            }));
          } else {
            animationId = requestAnimationFrame(checkTime);
          }
        };

        animationId = requestAnimationFrame(checkTime);

        return () => {
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
        };
      } else {
        // Clear immediately if time has passed
        setState((prev) => ({
          ...prev,
          newMatches: new Set(),
          removedMatches: new Set(),
          clearIndicatorsAt: undefined,
        }));
      }
    }
  }, [state.clearIndicatorsAt]);

  useEffect(() => {
    if (state.retryAt) {
      const now = Date.now();
      const timeUntilRetry = state.retryAt - now;

      if (timeUntilRetry > 0) {
        let animationId: number;

        const checkRetryTime = () => {
          if (Date.now() >= state.retryAt!) {
            // Trigger retry by setting a flag
            setState((prev) => ({
              ...prev,
              retryAt: undefined,
              shouldRetry: true,
            }));
          } else {
            animationId = requestAnimationFrame(checkRetryTime);
          }
        };

        animationId = requestAnimationFrame(checkRetryTime);

        return () => {
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
        };
      } else {
        // Retry immediately if time has passed
        if (fetchMatchesRef.current) {
          fetchMatchesRef.current();
        }
        setState((prev) => ({
          ...prev,
          retryAt: undefined,
        }));
      }
    }
  }, [state.retryAt]);

  const socketRef = useRef<Socket | null>(null);
  const retryCountRef = useRef(0);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const fetchMatchesRef = useRef<(() => Promise<void>) | null>(null);
  const maxRetries = 3;

  const fetchMatches = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const params = new URLSearchParams();
      if (filters.league) params.append('league', filters.league);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const queryString = params.toString();
      const endpoint = queryString
        ? `/api/matches?${queryString}`
        : '/api/matches';

      const data = await apiService.get<Match[] | { matches: Match[] }>(
        endpoint,
        {
          headers: {
            username: username,
          },
        }
      );
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
      // Use a state-based approach with useEffect
      setState((prev) => ({
        ...prev,
        clearIndicatorsAt: Date.now() + 1000,
      }));

      retryCountRef.current = 0;
    } catch (error: unknown) {
      console.error('Error fetching matches:', error);

      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));

      // Implement retry mechanism without setTimeout
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        const retryDelay = Math.pow(2, retryCountRef.current) * 1000;

        setState((prev) => ({
          ...prev,
          retryAt: Date.now() + retryDelay,
        }));
      }
    }
  }, [username, filters]);

  // Store fetchMatches in ref for use in other effects
  fetchMatchesRef.current = fetchMatches;

  // Handle retry trigger
  useEffect(() => {
    if (state.shouldRetry && fetchMatchesRef.current) {
      fetchMatchesRef.current();
      setState((prev) => ({
        ...prev,
        shouldRetry: false,
      }));
    }
  }, [state.shouldRetry]);

  const connectSocket = useCallback(() => {
    if (socketRef.current?.connected) return;

    // Only try to connect if we have a valid API_BASE_URL
    if (!API_BASE_URL || API_BASE_URL.trim() === '') {
      console.log('No API_BASE_URL provided, skipping socket connection');
      return;
    }

    try {
      socketRef.current = io(API_BASE_URL, {
        auth: { username },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 2000,
      });
    } catch (error) {
      console.error('Failed to create socket connection:', error);
      return;
    }

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      setState((prev) => ({ ...prev, error: null }));
      retryCountRef.current = 0; // Reset retry count on successful connection

      // Start heartbeat to keep connection alive
      heartbeatRef.current = setInterval(() => {
        if (socketRef.current?.connected) {
          socketRef.current.emit('ping');
        }
      }, 30000); // Ping every 30 seconds
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect immediately
        if (socketRef.current && !socketRef.current.connected) {
          socketRef.current.connect();
        }
      }
    });

    socketRef.current.on('connect_error', (error) => {
      console.warn(
        'Socket connection failed, falling back to polling:',
        error.message
      );
      // Don't set error state for socket connection failures
      // The app will continue to work with polling
    });

    socketRef.current.on('connect_timeout', () => {
      console.warn('Socket connection timeout, falling back to polling');
      // Don't set error state for timeouts
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
      setState((prev) => ({
        ...prev,
        clearIndicatorsAt: Date.now() + 1000,
      }));
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

    fetchMatches();

    // Set up polling as fallback (every 15 seconds)
    const pollInterval = setInterval(fetchMatches, 15000);

    // Try to connect to socket for real-time updates
    connectSocket();

    return () => {
      clearInterval(pollInterval);
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
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
