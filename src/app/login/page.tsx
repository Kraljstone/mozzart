'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      if (authService.isLoggedIn()) {
        router.push('/matches');
      } else {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoggingIn(true);
    try {
      const result = await authService.login({ username: inputValue });

      if (result.success) {
        router.push('/matches');
      } else {
        alert(`Login failed: ${result.message}`);
      }
    } catch {
      alert('Login failed: Unexpected error occurred');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className='min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <div className='text-yellow-400 text-xl font-bold'>
            🎰 Loading Mozzart Sports 🎰
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center'>
      <div className='max-w-md w-full bg-linear-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700 p-8'>
        <h1 className='text-3xl font-bold bg-linear-to-br from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-6 text-center'>
          🎰 MOZZART SPORTS 🎰
        </h1>

        <form onSubmit={handleUsernameSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='username'
              className='block text-sm font-medium text-gray-300 mb-2'
            >
              Enter your email to start watching matches
            </label>
            <input
              type='email'
              id='username'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder='your@email.com'
              className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent'
              required
            />
          </div>

          <button
            type='submit'
            disabled={isLoggingIn}
            className='w-full bg-linear-to-br from-yellow-500 via-red-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:from-yellow-600 hover:via-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
          >
            {isLoggingIn ? 'Validating...' : '🎰 Start Watching Matches 🎰'}
          </button>
        </form>
      </div>
    </div>
  );
}
