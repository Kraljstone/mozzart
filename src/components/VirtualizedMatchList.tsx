'use client';

import { Match } from '@/types/match.types';
import { MatchCard } from './MatchCard';
import { memo } from 'react';

interface VirtualizedMatchListProps {
  matches: Match[];
  newMatches: Set<string>;
  removedMatches: Set<string>;
  height?: number;
}

export const VirtualizedMatchList = memo(
  ({
    matches,
    newMatches,
    removedMatches,
    height = 700,
  }: VirtualizedMatchListProps) => {
    if (matches.length === 0) {
      return (
        <div className='text-center py-12'>
          <div className='text-6xl mb-4'>🎲</div>
          <h2 className='text-2xl font-bold text-gray-300 mb-2'>
            No Matches Found
          </h2>
          <p className='text-gray-400'>No matches are currently available</p>
        </div>
      );
    }

    return (
      <div
        className='w-full overflow-y-auto casino-scrollbar smooth-scroll'
        style={{ height: `${height}px` }}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4'>
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              isNew={newMatches.has(match.id)}
              isRemoved={removedMatches.has(match.id)}
            />
          ))}
        </div>
      </div>
    );
  }
);

VirtualizedMatchList.displayName = 'VirtualizedMatchList';
