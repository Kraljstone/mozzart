'use client';

import { MatchCardTeamsProps } from '@/types/match-card.types';

export const MatchCardTeams = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  onMouseEnter,
}: MatchCardTeamsProps) => {
  return (
    <div className='space-y-2' onMouseEnter={onMouseEnter}>
      <div className='flex justify-between items-center'>
        <span className='font-bold text-white text-lg'>{homeTeam}</span>
        <span className='text-2xl font-bold text-yellow-400'>
          {homeScore !== undefined ? homeScore : '-'}
        </span>
      </div>

      <div className='flex justify-between items-center'>
        <span className='font-bold text-white text-lg'>{awayTeam}</span>
        <span className='text-2xl font-bold text-yellow-400'>
          {awayScore !== undefined ? awayScore : '-'}
        </span>
      </div>
    </div>
  );
};
