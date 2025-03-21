import React, { useState, useEffect } from 'react';
import { getCompletedGames, getGame, Game, Move, deleteGame } from '../utils/gameService';

const ReplayPage: React.FC = () => {
  // Game state
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [currentBoard, setCurrentBoard] = useState<(string | null)[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Load games on component mount
  useEffect(() => {
    fetchGames();
  }, [pagination.page]);

  // Fetch completed games from the backend
  const fetchGames = async () => {
    try {
      setIsLoading(true);
      const response = await getCompletedGames(pagination.page, pagination.limit);
      setGames(response.games);
      setPagination(response.pagination);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('Failed to load games. Please try again later.');
      setIsLoading(false);
    }
  };
  // Select a game to replay
  const selectGame = async (id: string) => {
    try {
      setIsLoading(true);
      const game = await getGame(id);
      setSelectedGame(game);
      initializeBoard(game);
      setCurrentMoveIndex(0);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching game:', err);
      setError('Failed to load game. Please try again later.');
      setIsLoading(false);
    }
  };

  // Initialize an empty board
  const initializeBoard = (game: Game) => {
    const size = game.boardSize || 3;
    setCurrentBoard(Array(size * size).fill(null));
  };

  // Play next move
  const playNextMove = () => {
    if (!selectedGame || currentMoveIndex >= selectedGame.moves.length) {
      return;
    }

    const nextMove = selectedGame.moves[currentMoveIndex];

    // Create a new board array to ensure state update
    const newBoard = [...currentBoard];

    // Update the board with this move
    if (nextMove && typeof nextMove.position === 'number') {
      newBoard[nextMove.position] = nextMove.symbol;

      // Update the board state
      setCurrentBoard(newBoard);

      // Increment move index
      setCurrentMoveIndex(prev => prev + 1);
    } else {
      console.error('Invalid move data:', nextMove);
    }
  };

  // Play all moves instantly
  const playAllMoves = () => {
    if (!selectedGame) return;

    // Start with a fresh board
    const newBoard = Array(selectedGame.boardSize * selectedGame.boardSize).fill(null);

    // Apply all moves in sequence
    selectedGame.moves.forEach(move => {
      if (typeof move.position === 'number' && (move.symbol === 'X' || move.symbol === 'O')) {
        newBoard[move.position] = move.symbol;
      }
    });

    // Update the board with all moves applied
    setCurrentBoard(newBoard);
    setCurrentMoveIndex(selectedGame.moves.length);
  };

  // Reset replay
  const resetReplay = () => {
    if (!selectedGame) return;
    initializeBoard(selectedGame);
    setCurrentMoveIndex(0);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get result text
  const getResultText = (game: Game) => {
    if (!game.winner) return 'Unfinished';
    if (game.winner === 'tie') return 'Tie Game';

    const winnerName = game.winner === 'player1' ? game.player1Name : game.player2Name;
    return `${winnerName} Won`;
  };

  // Function to remove a game
  const removeGame = async (id: string) => {
    try {
      setIsLoading(true);
      // Call the remove game service (assuming it exists)
      await deleteGame(id);
      // Fetch the updated list of games
      fetchGames();
      setIsLoading(false);
    } catch (err) {
      console.error('Error removing game:', err);
      setError('Failed to remove game. Please try again later.');
      setIsLoading(false);
    }
  };

  console.log('Current board state:', currentBoard);

  return (
    <div className="px-4 py-12 pb-20 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-white text-center">
        Game Replays
      </h1>
      <p className="text-lg text-white/70 mb-8 text-center">
        Watch replays of previous games, move by move
      </p>

      {error && (
        <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-4 mb-8 text-red-500">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game List */}
        <div className="lg:col-span-1 bg-white/5 rounded-2xl p-6 border border-white/10 h-fit">
          <h2 className="text-xl font-bold mb-4 text-white">
            Previous Games
          </h2>

          {isLoading && !selectedGame ? (
            <div className="text-white/60 text-center py-8">
              Loading games...
            </div>
          ) : games.length === 0 ? (
            <div className="text-white/60 text-center py-8">
              No games found. Play some games to see replays.
            </div>
          ) : (
            <div className="max-h-[500px] overflow-y-auto space-y-2">
              {games.map(game => (
                <div
                  key={game.id}
                  onClick={() => selectGame(game.id)}
                  className={`
                    p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200
                    border
                    ${selectedGame?.id === game.id
                      ? 'bg-white/10 border-white/20'
                      : 'bg-transparent border-white/5 hover:bg-white/5'}
                  `}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">
                      {game.player1Name} vs {game.player2Name}
                    </span>
                    <span className="text-xs text-white/60">
                      {game.boardSize}×{game.boardSize}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-white/60">
                    <div>
                      {getResultText(game)}
                    </div>
                    <div>
                      {formatDate(game.createdAt)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGame(game.id);
                    }}
                    className="mt-2 px-3 py-1 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors duration-200"
                  >
                    Remove Replay
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className={`
                  px-3 py-2 rounded text-sm border-none
                  ${pagination.page === 1
                    ? 'bg-white/10 opacity-50 cursor-not-allowed'
                    : 'bg-white/20 cursor-pointer hover:bg-white/30'}
                `}
              >
                Previous
              </button>
              <div className="bg-white/10 px-3 py-2 rounded text-sm">
                {pagination.page} / {pagination.pages}
              </div>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className={`
                  px-3 py-2 rounded text-sm border-none
                  ${pagination.page === pagination.pages
                    ? 'bg-white/10 opacity-50 cursor-not-allowed'
                    : 'bg-white/20 cursor-pointer hover:bg-white/30'}
                `}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Game Replay */}
        <div className="lg:col-span-2">
          {selectedGame ? (
            <div>
              <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
                <h2 className="text-xl font-bold mb-2 text-white">
                  {selectedGame.player1Name} vs {selectedGame.player2Name}
                </h2>
                <div className="flex justify-between items-center text-sm text-white/60 mb-4">
                  <div>{formatDate(selectedGame.createdAt)}</div>
                  <div>{selectedGame.boardSize}×{selectedGame.boardSize} board</div>
                  <div>{getResultText(selectedGame)}</div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-player-x/20 flex items-center justify-center font-bold text-player-x">
                      X
                    </div>
                    <span>{selectedGame.player1Name}</span>
                  </div>
                  <div>vs</div>
                  <div className="flex items-center gap-2">
                    <span>{selectedGame.player2Name}</span>
                    <div className="w-6 h-6 rounded-full bg-player-o/20 flex items-center justify-center font-bold text-player-o">
                      O
                    </div>
                  </div>
                </div>

                <div className="rounded-lg p-3 bg-white/5 flex items-center justify-between">
                  <div>
                    Move {currentMoveIndex} of {selectedGame.moves.length}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={resetReplay}
                      disabled={currentMoveIndex === 0}
                      className={`
                        px-3 py-2 rounded text-sm
                        ${currentMoveIndex === 0
                          ? 'bg-white/10 opacity-50 cursor-not-allowed'
                          : 'bg-white/10 cursor-pointer hover:bg-white/20'}
                      `}
                    >
                      Reset
                    </button>
                    <button
                      onClick={playNextMove}
                      disabled={currentMoveIndex >= selectedGame.moves.length}
                      className={`
                        px-3 py-2 rounded text-sm
                        ${currentMoveIndex >= selectedGame.moves.length
                          ? 'bg-player-x/20 opacity-50 cursor-not-allowed'
                          : 'bg-player-x/20 cursor-pointer hover:bg-player-x/30'}
                      `}
                    >
                      Next Move
                    </button>
                    <button
                      onClick={playAllMoves}
                      disabled={currentMoveIndex >= selectedGame.moves.length}
                      className={`
                        px-3 py-2 rounded text-sm
                        ${currentMoveIndex >= selectedGame.moves.length
                          ? 'bg-player-o/20 opacity-50 cursor-not-allowed'
                          : 'bg-player-o/20 cursor-pointer hover:bg-player-o/30'}
                      `}
                    >
                      Play All
                    </button>
                  </div>
                </div>
              </div>

              {/* Replay Board */}
              <div className="bg-white/[0.03] rounded-2xl p-8 border border-white/5 backdrop-blur-md flex flex-col items-center">
                <div
                  className="grid gap-2 w-[320px] h-[320px] mx-auto"
                  style={{
                    gridTemplateColumns: `repeat(${selectedGame.boardSize}, 1fr)`,
                    gridTemplateRows: `repeat(${selectedGame.boardSize}, 1fr)`
                  }}
                >
                  {currentBoard.map((value, index) => (
                    <div
                      key={index}
                      className={`
                        flex items-center justify-center w-full h-full
                        bg-white/5 rounded-lg transition-all duration-300
                        border-2
                        ${value === 'X'
                          ? 'shadow-player-x border-player-x'
                          : value === 'O'
                            ? 'shadow-player-o border-player-o'
                            : 'border-white/5'}
                      `}
                    >
                      {value === 'X' && (
                        <div className={`
                          font-bold text-player-x -translate-y-0.5
                          ${selectedGame.boardSize <= 4 ? 'text-5xl' : selectedGame.boardSize <= 5 ? 'text-4xl' : 'text-3xl'}
                        `}>
                          X
                        </div>
                      )}
                      {value === 'O' && (
                        <div className={`
                          font-bold text-player-o
                          ${selectedGame.boardSize <= 4 ? 'text-5xl' : selectedGame.boardSize <= 5 ? 'text-4xl' : 'text-3xl'}
                        `}>
                          O
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 rounded-2xl py-12 px-6 border border-white/10 text-center text-white/60">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold mb-2 text-white">
                Select a Game to Replay
              </h3>
              <p>
                Choose a game from the list on the left to watch the replay.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReplayPage;
