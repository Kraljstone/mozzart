'use client';

import { Match } from '@/types/match';
import { Clock, MapPin, Users, Trophy, DollarSign, Heart } from 'lucide-react';
import { clsx } from 'clsx';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useState, memo } from 'react';

interface MatchCardProps {
  match: Match;
  isNew?: boolean;
  isRemoved?: boolean;
}

export const MatchCard = memo(({ match, isNew, isRemoved }: MatchCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Removed React Spring animations

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'text-red-400 bg-gradient-to-r from-red-900/50 to-red-800/50 border-red-500 shadow-red-500/25';
      case 'finished':
        return 'text-gray-400 bg-gradient-to-r from-gray-700/50 to-gray-600/50 border-gray-500';
      default:
        return 'text-blue-400 bg-gradient-to-r from-blue-900/50 to-blue-800/50 border-blue-500 shadow-blue-500/25';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live':
        return 'LIVE';
      case 'finished':
        return 'FT';
      default:
        return 'UPCOMING';
    }
  };

  return (
    <div
      className='relative w-full h-80 perspective-1000'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={clsx(
          'relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer',
          isHovered ? 'rotate-y-180' : ''
        )}
      >
        {/* Front of card */}
        <div
          className={clsx(
            'absolute inset-0 w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 p-6 shadow-2xl backface-hidden',
            {
              'border-green-400 bg-gradient-to-br from-green-900/50 to-green-800/50 animate-pulse shadow-green-500/25':
                isNew,
              'border-red-400 bg-gradient-to-br from-red-900/50 to-red-800/50 opacity-50':
                isRemoved,
              'border-gray-600': !isNew && !isRemoved,
            }
          )}
        >
          {/* New/Removed indicator */}
          {(isNew || isRemoved) && (
            <div
              className={clsx(
                'absolute -top-2 -right-2 px-3 py-1 text-xs font-bold rounded-full text-white shadow-lg',
                {
                  'bg-gradient-to-r from-green-500 to-green-600 animate-bounce shadow-green-500/50':
                    isNew,
                  'bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/50':
                    isRemoved,
                }
              )}
            >
              {isNew ? '🎉 NEW' : '❌ REMOVED'}
            </div>
          )}

          {/* Click indicator */}
          <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <div className='bg-gradient-to-r from-yellow-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg'>
              🎲 CLICK TO BET
            </div>
          </div>

          {/* Header with league and status */}
          <div className='flex justify-between items-center mb-3'>
            <div className='flex items-center gap-2'>
              <Trophy className='w-5 h-5 text-yellow-400' />
              <span className='text-sm font-bold text-yellow-300'>
                {match.league}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(match.id);
                }}
                className={clsx(
                  'p-1 rounded-full transition-all duration-300 hover:scale-110',
                  isFavorite(match.id)
                    ? 'text-red-500 hover:text-red-400'
                    : 'text-gray-400 hover:text-red-500'
                )}
              >
                <Heart
                  className={clsx(
                    'w-5 h-5',
                    isFavorite(match.id) ? 'fill-current' : ''
                  )}
                />
              </button>
              <span
                className={clsx(
                  'px-2 py-1 text-xs font-bold rounded-full border',
                  getStatusColor(match.status)
                )}
              >
                {getStatusText(match.status)}
              </span>
            </div>
          </div>

          {/* Teams and Score */}
          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <span className='font-bold text-white text-lg'>
                {match.homeTeam}
              </span>
              <span className='text-2xl font-bold text-yellow-400'>
                {match.homeScore !== undefined ? match.homeScore : '-'}
              </span>
            </div>

            <div className='flex justify-between items-center'>
              <span className='font-bold text-white text-lg'>
                {match.awayTeam}
              </span>
              <span className='text-2xl font-bold text-yellow-400'>
                {match.awayScore !== undefined ? match.awayScore : '-'}
              </span>
            </div>
          </div>

          {/* Match details */}
          <div className='mt-4 pt-3 border-t border-gray-600'>
            <div className='flex items-center justify-between text-sm text-gray-300'>
              <div className='flex items-center gap-1'>
                <Clock className='w-4 h-4 text-yellow-400' />
                <span className='font-medium'>
                  {formatTime(match.startTime)}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <span className='font-medium'>
                  {formatDate(match.startTime)}
                </span>
              </div>
            </div>

            {match.venue && (
              <div className='flex items-center gap-1 mt-1 text-sm text-gray-300'>
                <MapPin className='w-4 h-4 text-yellow-400' />
                <span className='font-medium'>{match.venue}</span>
              </div>
            )}

            {match.referee && (
              <div className='flex items-center gap-1 mt-1 text-sm text-gray-300'>
                <Users className='w-4 h-4 text-yellow-400' />
                <span className='font-medium'>Ref: {match.referee}</span>
              </div>
            )}
          </div>

          {/* Hover hint at bottom */}
          <div className='mt-4 pt-2 border-t border-gray-600'>
            <div className='text-center text-xs text-gray-400 group-hover:text-yellow-400 transition-colors duration-300'>
              💡 Hover to flip for betting odds
            </div>
          </div>
        </div>

        {/* Back of card - Betting Odds */}
        <div
          className={clsx(
            'absolute inset-0 w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-yellow-500/50 p-6 shadow-2xl backface-hidden rotate-y-180',
            {
              'border-green-400 bg-gradient-to-br from-green-900/50 to-green-800/50 animate-pulse shadow-green-500/25':
                isNew,
              'border-red-400 bg-gradient-to-br from-red-900/50 to-red-800/50 opacity-50':
                isRemoved,
            }
          )}
        >
          <div className='flex items-center justify-between mb-4'>
            <span className='text-lg font-bold text-yellow-300 flex items-center gap-2'>
              <DollarSign className='w-5 h-5 text-yellow-400' />
              🎰 BETTING ODDS 🎰
            </span>
          </div>

          <div className='space-y-4'>
            <div className='grid grid-cols-3 gap-3'>
              <div className='text-center p-3 bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-lg border border-blue-500/30'>
                <div className='text-xs text-blue-300 font-medium'>Home</div>
                <div className='font-bold text-blue-400 text-lg'>2.15</div>
              </div>
              <div className='text-center p-3 bg-gradient-to-br from-gray-700/50 to-gray-600/50 rounded-lg border border-gray-500/30'>
                <div className='text-xs text-gray-300 font-medium'>Draw</div>
                <div className='font-bold text-gray-300 text-lg'>3.40</div>
              </div>
              <div className='text-center p-3 bg-gradient-to-br from-green-900/50 to-green-800/50 rounded-lg border border-green-500/30'>
                <div className='text-xs text-green-300 font-medium'>Away</div>
                <div className='font-bold text-green-400 text-lg'>1.85</div>
              </div>
            </div>

            <button className='w-full bg-gradient-to-r hover:cursor-pointer from-yellow-500 via-red-500 to-pink-500 text-white py-3 px-4 rounded-lg font-bold text-lg hover:from-yellow-600 hover:via-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25'>
              🎲 PLACE BET 🎲
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

MatchCard.displayName = 'MatchCard';
