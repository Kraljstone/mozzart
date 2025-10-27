import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className='bg-red-900/50 border border-red-500 rounded-lg p-6 mb-6'>
      <div className='flex items-center gap-3'>
        <AlertCircle className='w-6 h-6 text-red-400' />
        <div>
          <h3 className='text-red-400 font-bold'>Connection Error</h3>
          <p className='text-red-300'>{error}</p>
          <button
            onClick={onRetry}
            className='mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};
