import React, { useState } from 'react';
import Board from '../components/Board';
import ScoreBoard from '../components/ScoreBoard';

const PlayPage: React.FC = () => {
  const [gameType, setGameType] = useState<'onePlayer' | 'twoPlayer'>('onePlayer');
  const [boardSize, setBoardSize] = useState<number>(3);
  const [scores, setScores] = useState({ player1: 0, player2: 0, ties: 0 });

  const handleGameEnd = (winner: 'player1' | 'player2' | 'tie') => {
    setScores(prevScores => {
      if (winner === 'player1') {
        return { ...prevScores, player1: prevScores.player1 + 1 };
      } else if (winner === 'player2') {
        return { ...prevScores, player2: prevScores.player2 + 1 };
      } else {
        return { ...prevScores, ties: prevScores.ties + 1 };
      }
    });
  };

  const resetScores = () => {
    setScores({ player1: 0, player2: 0, ties: 0 });
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">
        Play Tic-Tac-Toe
      </h1>

      {/* Game settings */}
      <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Game mode selection */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-3 text-white/90">Game Mode</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setGameType('onePlayer')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200
                  ${gameType === 'onePlayer'
                    ? 'bg-player-x text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                One Player
              </button>
              <button
                onClick={() => setGameType('twoPlayer')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200
                  ${gameType === 'twoPlayer'
                    ? 'bg-player-o text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                Two Players
              </button>
            </div>
          </div>

          {/* Board size selection */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-3 text-white/90">Board Size</h2>
            <div className="flex gap-3">
              {[3, 4, 5, 6].map(size => (
                <button
                  key={size}
                  onClick={() => setBoardSize(size)}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-200
                    ${boardSize === size
                      ? 'bg-highlight text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {size}×{size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main game board */}
      <div className="flex justify-center">
        <Board
          gameType={gameType}
          onGameEnd={handleGameEnd}
          boardSize={boardSize}
        />
      </div>
      {/* Score board */}
      <div className="flex justify-center mb-10">
        <ScoreBoard
          scores={scores}
          gameType={gameType}
          onReset={resetScores}
        />
      </div>

      {/* Reset scores button */}
      <div className="flex justify-center">
        <button
          onClick={resetScores}
          className="py-2 px-4 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
        >
          Reset Scores
        </button>
      </div>
    </div>
  );
};

export default PlayPage;