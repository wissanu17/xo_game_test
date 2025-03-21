import React, { useState, useEffect } from 'react';
import Logo from '../Logo';

const Navbar: React.FC = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const pathname = window.location.pathname;

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 920);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10 py-4 px-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <a
          href="/"
          className={`flex items-center gap-2 font-bold ${isSmallScreen ? 'text-xs' : 'text-xl'} text-white no-underline`}
        >
          <Logo />
          Tic-Tac-Toe
        </a>

        {/* Desktop menu */}
        <div className="flex gap-2">
          <a
            href="/"
            className={`
              px-3 py-2 rounded-lg ${isSmallScreen ? 'text-sm' : 'text-base'} transition-colors
              ${pathname === '/'
                ? 'bg-white/10 text-white font-bold'
                : 'text-white/70 hover:bg-white/5 hover:text-white'}
            `}
          >
            Home
          </a>
          <a
            href="/play"
            className={`
              px-3 py-2 rounded-lg ${isSmallScreen ? 'text-sm' : 'text-base'} transition-colors
              ${pathname === '/play'
                ? 'bg-white/10 text-white font-bold'
                : 'text-white/70 hover:bg-white/5 hover:text-white'}
            `}
          >
            Play Game
          </a>
          {/* <a
            href="/how-to-play"
            className={`
              px-3 py-2 rounded-lg ${isSmallScreen ? 'text-sm' : 'text-base'} transition-colors
              ${pathname === '/how-to-play'
                ? 'bg-white/10 text-white font-bold'
                : 'text-white/70 hover:bg-white/5 hover:text-white'}
            `}
          >
            How to Play
          </a> */}
          {/* <a
            href="/about"
            className={`
              px-3 py-2 rounded-lg ${isSmallScreen ? 'text-sm' : 'text-base'} transition-colors
              ${pathname === '/about'
                ? 'bg-white/10 text-white font-bold'
                : 'text-white/70 hover:bg-white/5 hover:text-white'}
            `}
          >
            About
          </a> */}
          <a
            href="/replays"
            className={`
              px-3 py-2 rounded-lg ${isSmallScreen ? 'text-sm' : 'text-base'} transition-colors
              ${pathname === '/replays'
                ? 'bg-white/10 text-white font-bold'
                : 'text-white/70 hover:bg-white/5 hover:text-white'}
            `}
          >
            Replays
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
