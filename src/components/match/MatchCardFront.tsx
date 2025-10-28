'use client';

import { clsx } from 'clsx';
import { MatchCardHeader } from './MatchCardHeader';
import { MatchCardTeams } from './MatchCardTeams';
import { MatchCardDetails } from './MatchCardDetails';
import { MatchCardFrontProps } from '@/types/match-card.types';

export const MatchCardFront = ({
  match,
  isNew,
  isRemoved,
  onHeaderMouseEnter,
  onHeaderMouseLeave,
  onTeamsMouseEnter,
  onDetailsMouseEnter,
}: MatchCardFrontProps) => {
  return (
    <div
      className={clsx(
        'absolute inset-0 w-full h-full bg-linear-to-br from-gray-800 to-gray-900 rounded-xl border-2 p-6 shadow-2xl backface-hidden',
        {
          'border-green-400 bg-linear-to-br from-green-900/50 to-green-800/50 animate-pulse shadow-green-500/25':
            isNew,
          'border-red-400 bg-linear-to-br from-red-900/50 to-red-800/50 opacity-50':
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
              'bg-linear-to-br from-green-500 to-green-600 animate-bounce shadow-green-500/50':
                isNew,
              'bg-linear-to-br from-red-500 to-red-600 shadow-red-500/50':
                isRemoved,
            }
          )}
        >
          {isNew ? '🎉 NEW' : '❌ REMOVED'}
        </div>
      )}

      {/* Click indicator */}
      <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
        <div className='bg-linear-to-br from-yellow-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg'>
          🎲 CLICK TO BET
        </div>
      </div>

      {/* Header with league and status */}
      <MatchCardHeader
        league={match.league}
        status={match.status}
        matchId={match.id}
        isNew={isNew}
        isRemoved={isRemoved}
        onMouseEnter={onHeaderMouseEnter}
        onMouseLeave={onHeaderMouseLeave}
      />

      {/* Teams and Score */}
      <MatchCardTeams
        homeTeam={match.homeTeam}
        awayTeam={match.awayTeam}
        homeScore={match.homeScore}
        awayScore={match.awayScore}
        onMouseEnter={onTeamsMouseEnter}
      />

      {/* Match details */}
      <MatchCardDetails
        matchTime={match.matchTime}
        venue={match.venue}
        referee={match.referee}
        onMouseEnter={onDetailsMouseEnter}
      />

      {/* Hover hint at bottom */}
      <div
        className='mt-4 pt-2 border-t border-gray-600'
        onMouseEnter={onDetailsMouseEnter}
      >
        <div className='text-center text-xs text-gray-400 group-hover:text-yellow-400 transition-colors duration-300'>
          💡 Hover to flip for betting odds
        </div>
      </div>
    </div>
  );
};
