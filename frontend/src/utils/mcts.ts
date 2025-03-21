// Monte Carlo Tree Search implementation for Tic-Tac-Toe

export type Board = (string | null)[][];

class Node {
  state: Board;
  player: string;
  parent: Node | null;
  children: Node[] = [];
  visits: number = 0;
  wins: number = 0;
  untriedMoves: { row: number; col: number }[];
  move: { row: number; col: number } | null;
  consecutiveToWin: number;

  constructor(
    state: Board,
    player: string,
    consecutiveToWin: number = 3,
    parent: Node | null = null,
    move: { row: number; col: number } | null = null
  ) {
    this.state = state;
    this.player = player;
    this.parent = parent;
    this.untriedMoves = this.getAvailableMoves();
    this.move = move;
    this.consecutiveToWin = consecutiveToWin;
  }

  getAvailableMoves(): { row: number; col: number }[] {
    const moves: { row: number; col: number }[] = [];
    this.state.forEach((row, rowIndex) =>
      row.forEach((cell, colIndex) => {
        if (cell === null) moves.push({ row: rowIndex, col: colIndex });
      })
    );
    return moves;
  }

  selectChild(): Node {
    const c = this.state.length <= 3 ? 1.414 : this.state.length <= 4 ? 1.5 : 1.6;
    return this.children.reduce((bestChild, child) => {
      const score = (child.wins / child.visits) + c * Math.sqrt(Math.log(this.visits) / child.visits);
      return score > (bestChild ? (bestChild.wins / bestChild.visits) + c * Math.sqrt(Math.log(this.visits) / bestChild.visits) : -Infinity) ? child : bestChild;
    }, null as Node | null)!;
  }

  addChild(move: { row: number; col: number }): Node {
    const newState = this.state.map(row => [...row]);
    newState[move.row][move.col] = this.player;
    const nextPlayer = this.player === 'X' ? 'O' : 'X';
    const childNode = new Node(newState, nextPlayer, this.consecutiveToWin, this, move);
    this.untriedMoves = this.untriedMoves.filter(m => !(m.row === move.row && m.col === move.col));
    this.children.push(childNode);
    return childNode;
  }

  update(result: number) {
    this.visits++;
    const learningRate = 0.1;
    this.wins = (1 - learningRate) * this.wins + learningRate * result * this.visits;
  }

  isFullyExpanded(): boolean {
    return this.untriedMoves.length === 0;
  }

  isTerminal(): boolean {
    return this.getWinner() !== null || this.getAvailableMoves().length === 0;
  }

  getWinner(): string | null {
    const size = this.state.length;
    const checkLine = (cells: (string | null)[]) => cells.every(cell => cell === cells[0] && cell !== null) ? cells[0] : null;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j <= size - this.consecutiveToWin; j++) {
        if (checkLine(this.state[i].slice(j, j + this.consecutiveToWin))) return this.state[i][j];
        if (checkLine(this.state.slice(j, j + this.consecutiveToWin).map(row => row[i]))) return this.state[j][i];
      }
    }

    for (let i = 0; i <= size - this.consecutiveToWin; i++) {
      for (let j = 0; j <= size - this.consecutiveToWin; j++) {
        if (checkLine(Array.from({ length: this.consecutiveToWin }, (_, k) => this.state[i + k][j + k]))) return this.state[i][j];
        if (checkLine(Array.from({ length: this.consecutiveToWin }, (_, k) => this.state[i + k][j + this.consecutiveToWin - 1 - k]))) return this.state[i][j + this.consecutiveToWin - 1];
      }
    }

    return null;
  }

  evaluateBoard(forPlayer: string): number {
    const winner = this.getWinner();
    if (winner === forPlayer) return 1;
    if (winner !== null) return 0;

    let nearWinsCount = 0;
    const size = this.state.length;
    const hasNearWin = (startRow: number, startCol: number, rowDelta: number, colDelta: number) => {
      const cells = Array.from({ length: this.consecutiveToWin }, (_, i) => this.state[startRow + i * rowDelta][startCol + i * colDelta]);
      const playerCount = cells.filter(cell => cell === forPlayer).length;
      const nullCount = cells.filter(cell => cell === null).length;
      return playerCount === this.consecutiveToWin - 1 && nullCount === 1;
    };

    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - this.consecutiveToWin; col++) {
        if (hasNearWin(row, col, 0, 1)) nearWinsCount++;
      }
    }

    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - this.consecutiveToWin; row++) {
        if (hasNearWin(row, col, 1, 0)) nearWinsCount++;
      }
    }

    for (let row = 0; row <= size - this.consecutiveToWin; row++) {
      for (let col = 0; col <= size - this.consecutiveToWin; col++) {
        if (hasNearWin(row, col, 1, 1)) nearWinsCount++;
        if (hasNearWin(row, col, 1, -1)) nearWinsCount++;
      }
    }

    return Math.min(0.7, nearWinsCount * 0.1);
  }
}

export class MCTS {
  iterations: number;
  maxTime: number;
  consecutiveToWin: number;
  
  constructor(iterations: number = 1000, maxTime: number = 2000, consecutiveToWin: number = 3) {
    this.iterations = iterations;
    this.maxTime = maxTime;
    this.consecutiveToWin = consecutiveToWin;
  }

  getBestMove(board: Board, currentPlayer: string): { row: number; col: number } {
    const rootNode = new Node(board, currentPlayer, this.consecutiveToWin);

    if (rootNode.untriedMoves.length === 1) return rootNode.untriedMoves[0];

    for (const move of rootNode.untriedMoves) {
      const testBoard = this.copyBoard(board);
      testBoard[move.row][move.col] = currentPlayer;
      if (new Node(testBoard, currentPlayer === 'X' ? 'O' : 'X', this.consecutiveToWin).getWinner() === currentPlayer) return move;
    }

    const opponent = currentPlayer === 'X' ? 'O' : 'X';
    for (const move of rootNode.untriedMoves) {
      const testBoard = this.copyBoard(board);
      testBoard[move.row][move.col] = opponent;
      if (new Node(testBoard, currentPlayer, this.consecutiveToWin).getWinner() === opponent) return move;
    }

    const startTime = Date.now();
    let i = 0;
    while (i < this.iterations && (Date.now() - startTime) < this.maxTime) {
      i++;
      let node: Node = rootNode;
      while (!node.isTerminal() && node.isFullyExpanded()) node = node.selectChild();
      if (!node.isTerminal() && !node.isFullyExpanded()) node = node.addChild(node.untriedMoves[Math.floor(Math.random() * node.untriedMoves.length)]);
      const result = this.simulateRandomPlayout(node);
      while (node !== null) {
        node.update(result === null ? 0.5 : result === currentPlayer ? 1 : 0);
        node = node.parent!;
      }
    }

    return rootNode.children.reduce((bestChild, child) => {
      const score = (child.wins / child.visits) + Math.log(child.visits) / 10;
      return score > (bestChild ? (bestChild.wins / bestChild.visits) + Math.log(bestChild.visits) / 10 : -Infinity) ? child : bestChild;
    }, null as Node | null)?.move! || rootNode.untriedMoves[Math.floor(Math.random() * rootNode.untriedMoves.length)];
  }

  copyBoard(board: Board): Board {
    return board.map(row => [...row]);
  }

  simulateRandomPlayout(node: Node): string | null {
    const state = this.copyBoard(node.state);
    let currentPlayer = node.player;
    let opponentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    const maxDepth = 30;
    let depth = 0;

    while (depth < maxDepth) {
      depth++;
      const winner = this.checkWinner(state);
      if (winner !== null || this.isBoardFull(state)) return winner;

      const availableMoves: { row: number; col: number }[] = [];
      state.forEach((row, rowIndex) =>
        row.forEach((cell, colIndex) => {
          if (cell === null) availableMoves.push({ row: rowIndex, col: colIndex });
        })
      );

      if (availableMoves.length === 0) return null;

      for (const move of availableMoves) {
        state[move.row][move.col] = currentPlayer;
        if (this.checkWinner(state) === currentPlayer) return currentPlayer;
        state[move.row][move.col] = null;
      }

      if (Math.random() < 0.8) {
        const moveScores = availableMoves.map(move => {
          let score = 0;
          state[move.row][move.col] = currentPlayer;
          let blocks = false;
          for (const opponentMove of availableMoves) {
            if (opponentMove.row === move.row && opponentMove.col === move.col) continue;
            state[move.row][move.col] = null;
            state[opponentMove.row][opponentMove.col] = opponentPlayer;
            if (this.checkWinner(state) === opponentPlayer) blocks = true;
            state[opponentMove.row][opponentMove.col] = null;
            state[move.row][move.col] = currentPlayer;
            if (blocks) break;
          }
          if (blocks) score += 5;
          const center = Math.floor(state.length / 2);
          const distToCenter = Math.abs(move.row - center) + Math.abs(move.col - center);
          score += Math.max(0, 3 - distToCenter);
          state[move.row][move.col] = null;
          return { move, score };
        });

        const topMoves = moveScores.sort((a, b) => b.score - a.score).slice(0, Math.min(3, moveScores.length));
        const selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)].move;
        state[selectedMove.row][selectedMove.col] = currentPlayer;
      } else {
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        state[randomMove.row][randomMove.col] = currentPlayer;
      }

      [currentPlayer, opponentPlayer] = [opponentPlayer, currentPlayer];
    }

    const evaluationNode = new Node(state, opponentPlayer, this.consecutiveToWin);
    const evalForX = evaluationNode.evaluateBoard('X');
    const evalForO = evaluationNode.evaluateBoard('O');
    return evalForX > evalForO ? 'X' : evalForO > evalForX ? 'O' : null;
  }

  checkWinner(state: Board): string | null {
    const size = state.length;
    const checkLine = (cells: (string | null)[]) => cells.every(cell => cell === cells[0] && cell !== null) ? cells[0] : null;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j <= size - this.consecutiveToWin; j++) {
        if (checkLine(state[i].slice(j, j + this.consecutiveToWin))) return state[i][j];
        if (checkLine(state.slice(j, j + this.consecutiveToWin).map(row => row[i]))) return state[j][i];
      }
    }

    for (let i = 0; i <= size - this.consecutiveToWin; i++) {
      for (let j = 0; j <= size - this.consecutiveToWin; j++) {
        if (checkLine(Array.from({ length: this.consecutiveToWin }, (_, k) => state[i + k][j + k]))) return state[i][j];
        if (checkLine(Array.from({ length: this.consecutiveToWin }, (_, k) => state[i + k][j + this.consecutiveToWin - 1 - k]))) return state[i][j + this.consecutiveToWin - 1];
      }
    }

    return null;
  }

  isBoardFull(state: Board): boolean {
    return state.every(row => row.every(cell => cell !== null));
  }
}

export function convert1DTo2D(board: (string | null)[], size: number): Board {
  return Array.from({ length: size }, (_, i) => board.slice(i * size, i * size + size));
}

export function convert2DTo1D(board: Board): (string | null)[] {
  return board.flat();
}

export function getBestMoveMCTS(
  board: (string | null)[],
  size: number,
  currentPlayer: string,
  iterations: number = 1000,
  consecutiveToWin: number = 3
): number {
  console.log(`Board Size: ${size}, Iterations: ${iterations}`);
  try {
    const scaledIterations = Math.min(iterations,
      size <= 3 ? iterations :
      size === 4 ? Math.floor(iterations * 0.9) :
      size === 5 ? Math.floor(iterations * 0.9) :
      Math.floor(iterations * 0.9));

    const maxTime = size <= 3 ? 2000 :
                   size === 4 ? 2500 :
                   size === 5 ? 3000 : 3500;
                   console.log(`Scaled Iterations: ${scaledIterations}`);
    const board2D = convert1DTo2D(board, size);
    const mcts = new MCTS(scaledIterations, maxTime, consecutiveToWin);
    const bestMove = mcts.getBestMove(board2D, currentPlayer);

    return bestMove.row * size + bestMove.col;
  } catch (error) {
    console.error('MCTS error:', error);

    try {
      const center = Math.floor(size / 2);
      if (board[center * size + center] === null) return center * size + center;

      const corners = [0, size - 1, size * (size - 1), size * size - 1];
      for (const corner of corners) {
        if (board[corner] === null) return corner;
      }

      const emptySquares = board.map((cell, index) => cell === null ? index : -1).filter(index => index !== -1);
      if (emptySquares.length > 0) return emptySquares[Math.floor(Math.random() * emptySquares.length)];
    } catch (fallbackError) {
      console.error('Fallback strategy error:', fallbackError);
    }

    return board.findIndex(cell => cell === null) ?? -1;
  }
}
