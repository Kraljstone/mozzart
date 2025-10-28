'use client';

import { Trophy, Heart } from 'lucide-react';
import { clsx } from 'clsx';
import { useFavorites } from '@/contexts/FavoritesContext';
import { MatchCardHeaderProps } from '@/types/match-card.types';

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

export const MatchCardHeader = ({
  league,
  status,
  matchId,
  onMouseEnter,
  onMouseLeave,
}: MatchCardHeaderProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div
      className='flex justify-between items-center mb-3'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className='flex items-center gap-2'>
        <Trophy className='w-5 h-5 text-yellow-400' />
        <span className='text-sm font-bold text-yellow-300'>{league}</span>
      </div>
      <div className='flex items-center gap-2'>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(matchId);
          }}
          className={clsx(
            'p-1 rounded-full transition-all duration-300 hover:scale-110 hover:cursor-pointer',
            isFavorite(matchId)
              ? 'text-red-500 hover:text-red-400'
              : 'text-gray-400 hover:text-red-500'
          )}
        >
          <Heart
            className={clsx(
              'w-5 h-5',
              isFavorite(matchId) ? 'fill-current' : ''
            )}
          />
        </button>
        <span
          className={clsx(
            'px-2 py-1 text-xs font-bold rounded-full border',
            getStatusColor(status)
          )}
        >
          {getStatusText(status)}
        </span>
      </div>
    </div>
  );
};
