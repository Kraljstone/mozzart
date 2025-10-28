import { LoadingStateProps } from '@/types/state.types';

export const LoadingState = ({
  message = '🎰 Loading matches... 🎰',
  isUpdating = false,
}: LoadingStateProps) => {
  if (isUpdating) {
    return (
      <div className='fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3'>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
          <span className='text-sm text-gray-700'>Updating matches...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='text-center py-12'>
      <div className='w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
      <p className='text-yellow-400 text-lg font-bold'>{message}</p>
    </div>
  );
};
