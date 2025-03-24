import { useState, useEffect, useCallback, useRef } from 'react'
import { checkWinner, getBestMove } from '../utils/gameLogic'
import { useGameData } from '../hooks/useGameData'

type BoardProps = {
  gameType: 'onePlayer' | 'twoPlayer'
  onGameEnd: (winner: 'player1' | 'player2' | 'tie') => void
  boardSize?: number
}

const Board = ({ gameType, onGameEnd, boardSize = 3 }: BoardProps) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(boardSize * boardSize).fill(null))
  const [isXNext, setIsXNext] = useState<boolean>(true)
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [isTie, setIsTie] = useState<boolean>(false)
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const hasNotifiedEndGame = useRef<boolean>(false)
  
  // Use our custom hook to handle game data collection
  const { 
    isConnected, 
    isError, 
    recordMove, 
    recordGameResult, 
    resetGameData 
  } = useGameData(gameType, boardSize);
  
  // Reset game when gameType or boardSize changes
  useEffect(() => {
    resetGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameType, boardSize])

  const resetGame = useCallback(() => {
    setBoard(Array(boardSize * boardSize).fill(null))
    setIsXNext(true)
    setGameOver(false)
    setWinner(null)
    setIsTie(false)
    setShowPopup(false)
    hasNotifiedEndGame.current = false
    
    // Reset game data in our backend
    resetGameData();
  }, [boardSize, resetGameData])

  // Check for winner only when board changes
  useEffect(() => {
    // Always use 3 as the consecutive count needed to win
    // const consecutiveToWin = 3

    let consecutiveToWin = 3; // Default value
    if (boardSize === 4) consecutiveToWin = 3;
    if (boardSize === 5) consecutiveToWin = 4;
    else if (boardSize >= 6) consecutiveToWin = 5;

    // let consecutiveToWin =  boardSize;

    const currentWinner = checkWinner(board, boardSize, consecutiveToWin)
    const isBoardFull = board.every(square => square !== null)
    
    if ((currentWinner || isBoardFull) && !gameOver) {
      setGameOver(true)
      setWinner(currentWinner)
      setIsTie(isBoardFull && !currentWinner)
      setShowPopup(true)
      
      // Determine game result for backend
      let result: 'player1' | 'player2' | 'tie' | null = null;
      
      if (currentWinner === 'X') {
        result = 'player1';
      } else if (currentWinner === 'O') {
        result = gameType === 'onePlayer' ? 'player2' : 'player1';
      } else if (isBoardFull) {
        result = 'tie';
      }
      
      // Record game result in backend
      recordGameResult(result);
      
      if (!hasNotifiedEndGame.current) {
        hasNotifiedEndGame.current = true
        
        if (currentWinner === 'X') {
          onGameEnd('player1')
        } else if (currentWinner === 'O') {
          onGameEnd(gameType === 'onePlayer' ? 'player2' : 'player1')
        } else if (isBoardFull) {
          onGameEnd('tie')
        }
      }
    }
  }, [board, gameOver, gameType, onGameEnd, boardSize, recordGameResult])

  // Handle human player's move
  const handleClick = useCallback((index: number) => {
    if (board[index] || gameOver) return
    
    const newBoard = [...board]
    const symbol = isXNext ? 'X' : 'O';
    newBoard[index] = symbol
    setBoard(newBoard)
    
    // Record move in backend
    recordMove(index, symbol as 'X' | 'O');
    
    setIsXNext(!isXNext)
  }, [board, gameOver, isXNext, recordMove])

  // Computer's move
  const computerMove = useCallback(() => {
    if (gameOver) return
    
    let consecutiveToWin = 3; // Default value
    if (boardSize === 4) consecutiveToWin = 3;
    if (boardSize === 5) consecutiveToWin = 4;
    else if (boardSize >= 6) consecutiveToWin = 5;
    
    // Call the AI with the correct winning condition
    const bestMoveIndex = getBestMove(board, boardSize, 'O', consecutiveToWin)
    
    if (bestMoveIndex !== -1 && bestMoveIndex < board.length && board[bestMoveIndex] === null) {
      const newBoard = [...board]
      newBoard[bestMoveIndex] = 'O'
      setBoard(newBoard)
      
      // Record computer's move in backend
      recordMove(bestMoveIndex, 'O');
      
      setIsXNext(true)
    }
  }, [board, gameOver, boardSize, recordMove])

  // Computer move effect with delay
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    
    if (gameType === 'onePlayer' && !isXNext && !gameOver) {
      timer = setTimeout(() => {
        computerMove()
      }, 1000)
    }
    
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isXNext, gameOver, gameType, computerMove])

  // Function to get winner message
  const getWinnerMessage = () => {
    if (winner === 'X') {
      return gameType === 'onePlayer' ? 'Player Wins!' : 'Player 1 Wins!';
    } else if (winner === 'O') {
      return gameType === 'onePlayer' ? 'Computer Wins!' : 'Player 2 Wins!';
    } else {
      return 'It\'s a Tie!';
    }
  };
  
  return (
    <div className="relative w-[320px] h-[320px] mx-auto overflow-hidden">
      {/* Game grid */}
      <div 
        className="grid w-full h-full gap-2"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${boardSize}, 1fr)`
        }}
      >
        {Array(boardSize * boardSize).fill(null).map((_, index) => (
          <div 
            key={index} 
            className={`
              board-cell
              ${board[index] === 'X' ? 'board-cell-x' : ''}
              ${board[index] === 'O' ? 'board-cell-o' : ''}
              ${!gameOver && (gameType === 'twoPlayer' || (gameType === 'onePlayer' && isXNext)) && !board[index] ? 'cursor-pointer hover:scale-105' : ''}
              ${board[index] ? 'scale-100' : 'scale-95'}
            `}
            onClick={() => {
              // Player can only make a move if:
              // - In two player mode OR
              // - In one player mode and it's the player's turn (X)
              if (!gameOver && (gameType === 'twoPlayer' || (gameType === 'onePlayer' && isXNext)) && !board[index]) {
                handleClick(index)
              }
            }}
            tabIndex={(!gameOver && (gameType === 'twoPlayer' || (gameType === 'onePlayer' && isXNext)) && !board[index]) ? 0 : -1}
            role="button"
            aria-label={`Square ${index}`}
          >
            {board[index] === 'X' && (
              <div className={`
                font-bold text-player-x -translate-y-[2px]
                ${boardSize <= 4 ? 'text-5xl' : boardSize <= 5 ? 'text-4xl' : 'text-3xl'}
              `}>
                X
              </div> 
            )}
            {board[index] === 'O' && (
              <div className={`
                font-bold text-player-o
                ${boardSize <= 4 ? 'text-5xl' : boardSize <= 5 ? 'text-4xl' : 'text-3xl'}
              `}>
                O
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Error message if connection to backend fails */}
      {isError && (
        <div className="absolute -top-[50px] left-0 right-0 text-center text-red-500 text-xs opacity-80">
          Game recording unavailable. Replays may not work.
        </div>
      )}

      {/* Reset game button - always visible */}
      <button
        onClick={resetGame}
        className="absolute -top-[60px] right-0 bg-white/10 border-none rounded-lg px-4 py-2 text-white font-bold cursor-pointer text-sm transition-all duration-200 hover:bg-white/20"
      >
        New Game
      </button>

      {/* Winner popup */}
      {showPopup && (
        <div 
          className="animate-fadeIn absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/85 p-6 rounded-xl shadow-lg z-10 text-center min-w-[220px] backdrop-blur-sm"
          style={{border: `2px solid ${winner === 'X' ? '#4ade80' : winner === 'O' ? '#60a5fa' : '#a855f7'}`}}
        >
          <div 
            className="text-3xl font-bold mb-4"
            style={{color: winner === 'X' ? '#4ade80' : winner === 'O' ? '#60a5fa' : '#a855f7'}}
          >
            {getWinnerMessage()}
          </div>
          <button
            onClick={resetGame}
            className="w-full py-2.5 px-5 text-base font-bold rounded-lg cursor-pointer transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: winner === 'X' ? '#4ade80' : winner === 'O' ? '#60a5fa' : '#a855f7',
              color: '#121212'
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {/* Winner message below the board - only if not showing popup */}
      {gameOver && !showPopup && (
        <div 
          className="absolute -bottom-[60px] left-0 right-0 text-center text-xl font-bold"
          style={{color: winner === 'X' ? '#4ade80' : winner === 'O' ? '#60a5fa' : '#a855f7'}}
        >
          {winner === 'X' 
            ? `${gameType === 'onePlayer' ? 'Player' : 'Player 1'} Wins!` 
            : winner === 'O' 
              ? `${gameType === 'onePlayer' ? 'Computer' : 'Player 2'} Wins!`
              : 'Tie Game!'}
        </div>
      )}
    </div>
  )
}

export default Board