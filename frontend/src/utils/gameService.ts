// API base URL - use environment variable or default to localhost in development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Move {
  position: number;
  symbol: 'X' | 'O';
  moveOrder: number;
}

export interface Game {
  id: string;
  createdAt: string;
  gameType: 'onePlayer' | 'twoPlayer';
  boardSize: number;
  winner: 'player1' | 'player2' | 'tie' | null;
  player1Name: string;
  player2Name: string;
  moves: Move[];
}

export interface PaginatedGames {
  games: Game[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

// Function to handle fetch errors
const handleFetchError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `API error: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
};

// Get list of games with pagination
export const getGames = async (page = 1, limit = 10): Promise<PaginatedGames> => {
  const response = await fetch(`${API_BASE_URL}/games?page=${page}&limit=${limit}`);
  return handleFetchError(response);
};

// Get a specific game by ID
export const getGame = async (id: string): Promise<Game> => {
  const response = await fetch(`${API_BASE_URL}/games/${id}`);
  return handleFetchError(response);
};

// Create a new game
export const createGame = async (
  gameType: 'onePlayer' | 'twoPlayer',
  boardSize: number,
  player1Name = 'Player 1',
  player2Name?: string,
  moves: Move[] = []
): Promise<Game> => {
  const response = await fetch(`${API_BASE_URL}/games`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gameType,
      boardSize,
      player1Name,
      player2Name,
      moves,
    }),
  });
  return handleFetchError(response);
};

// Add a move to an existing game
export const addMove = async (
  gameId: string,
  position: number,
  symbol: 'X' | 'O',
  moveOrder: number
): Promise<Move> => {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}/moves`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      position,
      symbol,
      moveOrder,
    }),
  });
  return handleFetchError(response);
};

// Update game (e.g., set winner)
export const updateGame = async (
  gameId: string,
  winner: 'player1' | 'player2' | 'tie' | null
): Promise<Game> => {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ winner }),
  });
  return handleFetchError(response);
};

// Delete a game
export const deleteGame = async (gameId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    return handleFetchError(response);
  }
};

// Get list of unique games with pagination
export const getUniqueGames = async (page = 1, limit = 10): Promise<PaginatedGames> => {
  const response = await fetch(`${API_BASE_URL}/games/unique?page=${page}&limit=${limit}`);
  return handleFetchError(response);
};

// Get list of completed games with pagination
export const getCompletedGames = async (page = 1, limit = 10): Promise<PaginatedGames> => {
  const response = await fetch(`${API_BASE_URL}/games/completed?page=${page}&limit=${limit}`);
  return handleFetchError(response);
};