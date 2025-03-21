import { getBestMoveMCTS } from './mcts';

// Check for a winner on the board with a fixed consecutive count of 3
export function checkWinner(
  board: (string | null)[],
  size: number = 3,
  consecutiveToWin: number = 3
): string | null {
  // Function to check if N consecutive cells are the same
  const areNConsecutive = (cells: (string | null)[]): string | null => {
    if (cells.length < consecutiveToWin) return null;

    for (let i = 0; i <= cells.length - consecutiveToWin; i++) {
      if (cells[i] !== null) {
        let allSame = true;
        for (let j = 1; j < consecutiveToWin; j++) {
          if (cells[i + j] !== cells[i]) {
            allSame = false;
            break;
          }
        }
        if (allSame) return cells[i];
      }
    }
    return null;
  };

  // Check rows
  for (let row = 0; row < size; row++) {
    const rowCells = board.slice(row * size, (row + 1) * size);
    const winner = areNConsecutive(rowCells);
    if (winner) return winner;
  }

  // Check columns
  for (let col = 0; col < size; col++) {
    const colCells = [];
    for (let row = 0; row < size; row++) {
      colCells.push(board[row * size + col]);
    }
    const winner = areNConsecutive(colCells);
    if (winner) return winner;
  }

  // Check diagonals
  for (let row = 0; row <= size - consecutiveToWin; row++) {
    for (let col = 0; col <= size - consecutiveToWin; col++) {
      // Check diagonal from top-left to bottom-right
      const diag1Cells = [];
      for (let i = 0; i < consecutiveToWin; i++) {
        diag1Cells.push(board[(row + i) * size + (col + i)]);
      }
      const winner1 = areNConsecutive(diag1Cells);
      if (winner1) return winner1;

      // Check diagonal from top-right to bottom-left
      const diag2Cells = [];
      for (let i = 0; i < consecutiveToWin; i++) {
        diag2Cells.push(board[(row + i) * size + (col + consecutiveToWin - 1 - i)]);
      }
      const winner2 = areNConsecutive(diag2Cells);
      if (winner2) return winner2;
    }
  }

  return null;
}

// Check if the board is full
export function isBoardFull(board: (string | null)[]): boolean {
  return board.every(cell => cell !== null);
}

// Get best move for the computer using MCTS
export function getBestMove(
  board: (string | null)[],
  size: number = 3,
  computerSymbol: string = 'O',
  consecutiveToWin: number = 3
): number {
  // MCTS for all board sizes
  const iterationsBySize = {
    3: 2000,
    4: 3000,
    5: 4000,
    6: 8000
  };

  // Get appropriate iteration count based on board size
  const iterations = iterationsBySize[size as keyof typeof iterationsBySize] || 1000;

  return getBestMoveMCTS(board, size, computerSymbol, iterations, consecutiveToWin);
}

// Helper function to find empty squares on the board
export function emptySquares(board: (string | null)[]): number[] {
  return board
    .map((square, i) => (square === null ? i : null))
    .filter((val) => val !== null) as number[];
}
