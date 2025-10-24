'use client';

import { Match } from '@/types/match';
import { Clock, MapPin, Users, Trophy } from 'lucide-react';
import { clsx } from 'clsx';

interface MatchCardProps {
  match: Match;
  isNew?: boolean;
  isRemoved?: boolean;
}

export const MatchCard = ({ match, isNew, isRemoved }: MatchCardProps) => {
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
        return 'text-red-500 bg-red-50 border-red-200';
      case 'finished':
        return 'text-gray-500 bg-gray-50 border-gray-200';
      default:
        return 'text-blue-500 bg-blue-50 border-blue-200';
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
      className={clsx(
        'relative bg-white rounded-lg border-2 p-4 shadow-sm transition-all duration-300 hover:shadow-md',
        {
          'border-green-300 bg-green-50 animate-pulse': isNew,
          'border-red-300 bg-red-50 opacity-50': isRemoved,
          'border-gray-200': !isNew && !isRemoved,
        }
      )}
    >
      {/* New/Removed indicator */}
      {(isNew || isRemoved) && (
        <div
          className={clsx(
            'absolute -top-2 -right-2 px-2 py-1 text-xs font-bold rounded-full text-white',
            {
              'bg-green-500 animate-bounce': isNew,
              'bg-red-500': isRemoved,
            }
          )}
        >
          {isNew ? 'NEW' : 'REMOVED'}
        </div>
      )}

      {/* Header with league and status */}
      <div className='flex justify-between items-center mb-3'>
        <div className='flex items-center gap-2'>
          <Trophy className='w-4 h-4 text-yellow-500' />
          <span className='text-sm font-medium text-gray-600'>
            {match.league}
          </span>
        </div>
        <span
          className={clsx(
            'px-2 py-1 text-xs font-bold rounded-full border',
            getStatusColor(match.status)
          )}
        >
          {getStatusText(match.status)}
        </span>
      </div>

      {/* Teams and Score */}
      <div className='space-y-2'>
        <div className='flex justify-between items-center'>
          <span className='font-semibold text-gray-900'>{match.homeTeam}</span>
          <span className='text-lg font-bold text-gray-900'>
            {match.homeScore !== undefined ? match.homeScore : '-'}
          </span>
        </div>

        <div className='flex justify-between items-center'>
          <span className='font-semibold text-gray-900'>{match.awayTeam}</span>
          <span className='text-lg font-bold text-gray-900'>
            {match.awayScore !== undefined ? match.awayScore : '-'}
          </span>
        </div>
      </div>

      {/* Match details */}
      <div className='mt-4 pt-3 border-t border-gray-100'>
        <div className='flex items-center justify-between text-sm text-gray-500'>
          <div className='flex items-center gap-1'>
            <Clock className='w-4 h-4' />
            <span>{formatTime(match.startTime)}</span>
          </div>
          <div className='flex items-center gap-1'>
            <span>{formatDate(match.startTime)}</span>
          </div>
        </div>

        {match.venue && (
          <div className='flex items-center gap-1 mt-1 text-sm text-gray-500'>
            <MapPin className='w-4 h-4' />
            <span>{match.venue}</span>
          </div>
        )}

        {match.referee && (
          <div className='flex items-center gap-1 mt-1 text-sm text-gray-500'>
            <Users className='w-4 h-4' />
            <span>Ref: {match.referee}</span>
          </div>
        )}
      </div>
    </div>
  );
};
