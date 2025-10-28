import { RefreshCw, LogOut, Wifi, WifiOff } from 'lucide-react';
import { HeaderProps } from '@/types/layout.types';

export const Header = ({
  isConnected,
  lastUpdated,
  onRefresh,
  onLogout,
}: HeaderProps) => {
  return (
    <header className='bg-linear-to-br from-gray-800 to-gray-900 shadow-2xl border-b border-yellow-500/30'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-4'>
          <div>
            <h1 className='text-2xl font-bold bg-linear-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent'>
              🎰 LIVE SPORTS MATCHES 🎰
            </h1>
            <div className='flex items-center gap-4 mt-2'>
              <div className='flex items-center gap-2'>
                {isConnected ? (
                  <Wifi className='w-4 h-4 text-green-400' />
                ) : (
                  <WifiOff className='w-4 h-4 text-red-400' />
                )}
                <span className='text-gray-300 text-sm'>
                  {isConnected ? 'Live Updates' : 'Polling Mode'}
                </span>
              </div>
              {lastUpdated && (
                <span className='text-gray-300 text-sm'>
                  Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={onRefresh}
              className='bg-linear-to-r from-blue-500 to-blue-600
               hover:cursor-pointer text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2'
            >
              <RefreshCw className='w-4 h-4' />
              Refresh
            </button>
            <button
              onClick={onLogout}
              className='bg-linear-to-r from-red-500 to-red-600
               hover:cursor-pointer text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2'
            >
              <LogOut className='w-4 h-4' />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
