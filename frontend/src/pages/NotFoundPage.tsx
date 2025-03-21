import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 animate-fadeIn">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
        404
      </h1>

      <h2 className="text-3xl font-bold mb-4 text-white">
        Page Not Found
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <div className="bg-white/5 p-5 rounded-xl text-center">
          <a
            href="/play"
            className="inline-block px-6 py-3 bg-player-x text-black font-bold rounded-lg hover:bg-player-x/90 transition-all"
          >
            Play Now
          </a>
        </div>
        
        <div className="bg-white/5 p-5 rounded-xl text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-player-o text-black font-bold rounded-lg hover:bg-player-o/90 transition-all"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
