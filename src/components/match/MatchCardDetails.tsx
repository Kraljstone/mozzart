'use client';

import { Clock, MapPin, Users } from 'lucide-react';
import { MatchCardDetailsProps } from '@/types/match-card.types';

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

export const MatchCardDetails = ({
  matchTime,
  venue,
  referee,
  onMouseEnter,
}: MatchCardDetailsProps) => {
  return (
    <div
      className='mt-4 pt-3 border-t border-gray-600'
      onMouseEnter={onMouseEnter}
    >
      <div className='flex items-center justify-between text-sm text-gray-300'>
        <div className='flex items-center gap-1'>
          <Clock className='w-4 h-4 text-yellow-400' />
          <span className='font-medium'>{formatTime(matchTime)}</span>
        </div>
        <div className='flex items-center gap-1'>
          <span className='font-medium'>{formatDate(matchTime)}</span>
        </div>
      </div>

      {venue && (
        <div className='flex items-center gap-1 mt-1 text-sm text-gray-300'>
          <MapPin className='w-4 h-4 text-yellow-400' />
          <span className='font-medium'>{venue}</span>
        </div>
      )}

      {referee && (
        <div className='flex items-center gap-1 mt-1 text-sm text-gray-300'>
          <Users className='w-4 h-4 text-yellow-400' />
          <span className='font-medium'>Ref: {referee}</span>
        </div>
      )}
    </div>
  );
};
