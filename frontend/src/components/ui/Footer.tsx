import React from 'react';
import Logo from '../Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black/5 backdrop-blur-md border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
        <div className="flex flex-wrap justify-between gap-8">
          {/* Logo and description */}
          <div className="max-w-xs">
            <div className="flex items-center mb-4">
              <Logo />
              <span className="font-bold text-2xl text-white">
                Tic-Tac-Toe (XO)
              </span>
            </div>
            <p className="text-white/70 mb-4">
              Play the Tic-Tac-Toe game with friend or Computer.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 text-center text-white/70">
          <p>© {currentYear} Tic-Tac-Toe. Made by Potae.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
