export default function MainLoading() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
        <div className='text-yellow-400 text-xl font-bold'>
          🎰 Loading Matches 🎰
        </div>
      </div>
    </div>
  );
}
