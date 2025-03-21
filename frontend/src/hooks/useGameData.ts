import { useState, useCallback, useEffect } from 'react';
import { createGame, addMove, updateGame } from '../utils/gameService';

type GameType = 'onePlayer' | 'twoPlayer';
type Symbol = 'X' | 'O';
type GameResult = 'player1' | 'player2' | 'tie' | null;

interface Move {
  position: number;
  symbol: Symbol;
  moveOrder: number;
}

/**
 * Custom hook to manage game data collection for replays
 */
export const useGameData = (gameType: GameType, boardSize: number) => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [moves, setMoves] = useState<Move[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  // Initialize a new game in the database
  const initializeGame = useCallback(async () => {
    try {
      // Only try to initialize if API URL is configured
      if (import.meta.env.VITE_API_URL) {
        const game = await createGame(gameType, boardSize);
        setGameId(game.id);
        setIsConnected(true);
        setIsError(false);
        setMoves([]);
        return game.id;
      }
      return null;
    } catch (error) {
      console.error('Failed to initialize game data:', error);
      setIsError(true);
      setIsConnected(false);
      return null;
    }
  }, [gameType, boardSize]);

  // Record a move
  const recordMove = useCallback(async (position: number, symbol: Symbol) => {
    if (!gameId || !import.meta.env.VITE_API_URL) return;

    try {
      // Add to local state first
      const moveOrder = moves.length + 1;
      const newMove = { position, symbol, moveOrder };
      setMoves((prevMoves) => [...prevMoves, newMove]);

      // Then send to server
      await addMove(gameId, position, symbol, moveOrder);
    } catch (error) {
      console.error('Failed to record move:', error);
      setIsError(true);
    }
  }, [gameId, moves]);

  // Record game result
  const recordGameResult = useCallback(async (result: GameResult) => {
    if (!gameId || !import.meta.env.VITE_API_URL) return;

    try {
      await updateGame(gameId, result);
    } catch (error) {
      console.error('Failed to record game result:', error);
      setIsError(true);
    }
  }, [gameId]);

  // Reset game data
  const resetGameData = useCallback(async () => {
    // Clear current state
    setMoves([]);

    // Initialize a new game
    await initializeGame();
  }, [initializeGame]);

  // Initialize on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return {
    gameId,
    moves,
    isConnected,
    isError,
    recordMove,
    recordGameResult,
    resetGameData
  };
};
