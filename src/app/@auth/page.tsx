'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';

export default function AuthPage() {
  const [inputValue, setInputValue] = useState('');
  const [validatedUsername, setValidatedUsername] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration safely
  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);

      const savedUsername = localStorage.getItem('mozzart_username');
      const savedTimestamp = localStorage.getItem('mozzart_username_timestamp');

      if (savedUsername && savedTimestamp) {
        const now = Date.now();
        const savedTime = parseInt(savedTimestamp);
        const oneDayInMs = 24 * 60 * 60 * 1000; // 1 day in milliseconds

        // Check if saved data is less than 1 day old
        if (now - savedTime < oneDayInMs) {
          setInputValue(savedUsername);
          setValidatedUsername(savedUsername);
        } else {
          // Clear expired data
          localStorage.removeItem('mozzart_username');
          localStorage.removeItem('mozzart_username_timestamp');
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Listen for logout events
  useEffect(() => {
    const handleLogout = () => {
      setValidatedUsername('');
      setInputValue('');
    };

    window.addEventListener('mozzart-logout', handleLogout);
    return () => window.removeEventListener('mozzart-logout', handleLogout);
  }, []);

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoggingIn(true);
    try {
      const response = await fetch('/api/matches', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          username: inputValue,
        },
      });

      if (response.ok) {
        // Save to localStorage with timestamp
        localStorage.setItem('mozzart_username', inputValue);
        localStorage.setItem(
          'mozzart_username_timestamp',
          Date.now().toString()
        );
        setValidatedUsername(inputValue);

        // Dispatch custom login event
        window.dispatchEvent(
          new CustomEvent('mozzart-login', {
            detail: { username: inputValue },
          })
        );
      } else {
        // API call failed - show error
        const errorData = await response.json();
        alert(`Login failed: ${errorData.error || 'Invalid credentials'}`);
      }
    } catch {
      // Network or other error
      alert('Login failed: Unable to connect to server');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mozzart_username');
    localStorage.removeItem('mozzart_username_timestamp');
    setInputValue('');
    setValidatedUsername('');
  };

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <div className='text-yellow-400 text-xl font-bold'>
            🎰 Loading Mozzart Sports 🎰
          </div>
        </div>
      </div>
    );
  }

  // If user is logged in, don't show login form
  if (validatedUsername) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center'>
      <div className='max-w-md w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700 p-8'>
        <h1 className='text-3xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-6 text-center'>
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
            className='w-full bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:from-yellow-600 hover:via-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
          >
            {isLoggingIn ? 'Validating...' : '🎰 Start Watching Matches 🎰'}
          </button>
        </form>
      </div>
    </div>
  );
}
