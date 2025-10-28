'use client';

import { MatchCardProps } from '@/types/match.types';
import { clsx } from 'clsx';
import { useState, memo, useRef } from 'react';
import { MatchCardFront } from './MatchCardFront';
import { MatchCardBack } from './MatchCardBack';

export const MatchCard = memo(({ match, isNew, isRemoved }: MatchCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInHeader, setIsInHeader] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleHeaderMouseEnter = () => {
    setIsInHeader(true);
    // Clear timeout to prevent flip
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
  };

  const handleHeaderMouseLeave = () => {
    setIsInHeader(false);
  };

  const handleTeamsMouseEnter = () => {
    setIsInHeader(false);
    setIsHovered(true);
  };

  const handleDetailsMouseEnter = () => {
    setIsInHeader(false);
    setIsHovered(true);
  };

  return (
    <div
      className='relative w-full h-80 perspective-1000'
      onMouseEnter={() => {
        if (!isInHeader) {
          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
          }
          hoverTimeoutRef.current = setTimeout(() => {
            setIsHovered(true);
          }, 250);
        }
      }}
      onMouseLeave={() => {
        // Clear timeout and immediately hide
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
        setIsHovered(false);
        setIsInHeader(false);
      }}
    >
      <div
        className={clsx(
          'relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer',
          isHovered ? 'rotate-y-180' : ''
        )}
      >
        {/* Front of card */}
        <MatchCardFront
          match={match}
          isNew={isNew || false}
          isRemoved={isRemoved || false}
          onHeaderMouseEnter={handleHeaderMouseEnter}
          onHeaderMouseLeave={handleHeaderMouseLeave}
          onTeamsMouseEnter={handleTeamsMouseEnter}
          onDetailsMouseEnter={handleDetailsMouseEnter}
        />

        {/* Back of card - Betting Odds */}
        <MatchCardBack isNew={isNew || false} isRemoved={isRemoved || false} />
      </div>
    </div>
  );
});

MatchCard.displayName = 'MatchCard';
