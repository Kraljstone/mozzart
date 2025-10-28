import { NoMatchesProps } from '@/types/state.types';

export const NoMatches = ({ hasError = false }: NoMatchesProps) => {
  return (
    <div className='text-center py-12'>
      <div className='text-6xl mb-4'>🎲</div>
      <h2 className='text-2xl font-bold text-gray-300 mb-2'>
        No Matches Found
      </h2>
      <p className='text-gray-400'>
        {hasError
          ? 'Unable to load matches. Please try again.'
          : 'No matches are currently available'}
      </p>
    </div>
  );
};
