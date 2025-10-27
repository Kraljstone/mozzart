'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and redirect accordingly
    if (authService.isLoggedIn()) {
      router.push('/matches');
    } else {
      router.push('/login');
    }
  }, [router]);

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
