'use client';

import { DollarSign } from 'lucide-react';
import { clsx } from 'clsx';
import { MatchCardBackProps } from '@/types/match-card.types';

export const MatchCardBack = ({ isNew, isRemoved }: MatchCardBackProps) => {
  return (
    <div
      className={clsx(
        'absolute inset-0 w-full h-full bg-linear-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-yellow-500/50 p-6 shadow-2xl backface-hidden rotate-y-180',
        {
          'border-green-400 bg-linear-to-br from-green-900/50 to-green-800/50 animate-pulse shadow-green-500/25':
            isNew,
          'border-red-400 bg-linear-to-br from-red-900/50 to-red-800/50 opacity-50':
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
          <div className='text-center p-3 bg-linear-to-br from-blue-900/50 to-blue-800/50 rounded-lg border border-blue-500/30'>
            <div className='text-xs text-blue-300 font-medium'>Home</div>
            <div className='font-bold text-blue-400 text-lg'>2.15</div>
          </div>
          <div className='text-center p-3 bg-linear-to-br from-gray-700/50 to-gray-600/50 rounded-lg border border-gray-500/30'>
            <div className='text-xs text-gray-300 font-medium'>Draw</div>
            <div className='font-bold text-gray-300 text-lg'>3.40</div>
          </div>
          <div className='text-center p-3 bg-linear-to-br from-green-900/50 to-green-800/50 rounded-lg border border-green-500/30'>
            <div className='text-xs text-green-300 font-medium'>Away</div>
            <div className='font-bold text-green-400 text-lg'>1.85</div>
          </div>
        </div>

        <button className='w-full bg-linear-to-br hover:cursor-pointer from-yellow-500 via-red-500 to-pink-500 text-white py-3 px-4 rounded-lg font-bold text-lg hover:from-yellow-600 hover:via-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25'>
          🎲 PLACE BET 🎲
        </button>
      </div>
    </div>
  );
};
