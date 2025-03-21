import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 flex flex-col items-center text-center bg-[#121212] bg-[radial-gradient(circle_at_50%_10%,rgba(74,222,128,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(96,165,250,0.15),transparent_50%)]">
        {/* Animated elements */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-[15%] left-[10%] text-[8rem] text-green-400 rotate-[-15deg]">✕</div>
          <div className="absolute top-[60%] left-[75%] text-[12rem] text-blue-400 rotate-[15deg]">○</div>
          <div className="absolute top-[30%] left-[80%] text-[6rem] text-green-400 rotate-[20deg]">✕</div>
          <div className="absolute top-[70%] left-[15%] text-[10rem] text-blue-400 rotate-[-10deg]">○</div>
        </div>

        <div className="max-w-4xl relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-10 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            PLAY XO GAME !
          </h1>

          <div className="flex gap-4 justify-center mb-12">
            <a
              href="/play"
              className="inline-block py-3 px-6 bg-green-400 text-gray-900 rounded-lg font-bold text-lg shadow-lg shadow-green-400/30 hover:bg-green-500 transition-colors"
            >
              Play Now
            </a>
            {/* <PlayGameButton />
            <HowToPlayPage /> */}
            {/* <a
              href="/how-to-play"
              className="inline-block py-3 px-6 bg-white/10 text-white rounded-lg font-bold text-lg border border-white/20 hover:bg-white/20 transition-colors"
            >
              How to Play
            </a> */}
          </div>
        </div>

        {/* Game preview */}
        <div className="relative w-[320px] h-[320px] bg-white/5 rounded-xl overflow-hidden shadow-xl shadow-black/10 z-10 p-4 border border-white/10">
          <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full">
            <div className="flex items-center justify-center bg-white/10 rounded-lg shadow-md shadow-green-400/50 border-2 border-green-400">
              <div className="text-5xl font-bold text-green-400">X</div>
            </div>
            <div className="flex items-center justify-center bg-white/5 rounded-lg"></div>
            <div className="flex items-center justify-center bg-white/10 rounded-lg shadow-md shadow-blue-400/50 border-2 border-blue-400">
              <div className="text-5xl font-bold text-blue-400">O</div>
            </div>
            <div className="flex items-center justify-center bg-white/5 rounded-lg"></div>
            <div className="flex items-center justify-center bg-white/10 rounded-lg shadow-md shadow-green-400/50 border-2 border-green-400">
              <div className="text-5xl font-bold text-green-400">X</div>
            </div>
            <div className="flex items-center justify-center bg-white/5 rounded-lg"></div>
            <div className="flex items-center justify-center bg-white/5 rounded-lg"></div>
            <div className="flex items-center justify-center bg-white/10 rounded-lg shadow-md shadow-blue-400/50 border-2 border-blue-400">
              <div className="text-5xl font-bold text-blue-400">O</div>
            </div>
            <div className="flex items-center justify-center bg-white/10 rounded-lg shadow-md shadow-green-400/50 border-2 border-green-400">
              <div className="text-5xl font-bold text-green-400">X</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section - Continue converting the rest of the component */}
    </div>
  );
};

export default HomePage;
