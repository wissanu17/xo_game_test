import { memo } from 'react'

type ScoreBoardProps = {
  scores: {
    player1: number
    player2: number
    ties: number
  }
  gameType: 'onePlayer' | 'twoPlayer'
  onReset: () => void;
}

// Use memo to prevent unnecessary re-renders
const ScoreBoard = memo(({ scores, gameType }: ScoreBoardProps) => {
  
  return (
    <div className="flex items-center justify-between w-full max-w-[380px] mt-6 p-4 bg-white/5 rounded-xl shadow-lg backdrop-blur-sm">
      {/* Player 1 / Player Section */}
      <div className="flex flex-col items-center justify-center px-2 min-w-[80px]">
        <p className="text-sm font-bold mb-1 text-player-x opacity-90">
          {gameType === 'onePlayer' ? 'PLAYER' : 'PLAYER 1'}
        </p>
        <div className="flex items-center justify-center p-2 rounded-lg bg-player-x/15 min-w-[50px] min-h-[50px]">
          <span className="text-2xl font-bold text-player-x">
            {scores.player1}
          </span>
        </div>
        <div className="text-xl mt-2 font-bold text-player-x">
          X
        </div>
      </div>

      {/* Ties Section */}
      <div className="flex flex-col items-center justify-center px-2 min-w-[80px]">
        <p className="text-sm font-bold mb-1 text-highlight opacity-90">
          TIES
        </p>
        <div className="flex items-center justify-center p-2 rounded-lg bg-highlight/15 min-w-[50px] min-h-[50px]">
          <span className="text-2xl font-bold text-highlight">
            {scores.ties}
          </span>
        </div>
        <div className="text-xl mt-2 font-bold text-highlight opacity-70">
          =
        </div>
      </div>

      {/* Player 2 / Computer Section */}
      <div className="flex flex-col items-center justify-center px-2 min-w-[80px]">
        <p className="text-sm font-bold mb-1 text-player-o opacity-90">
          {gameType === 'onePlayer' ? 'COMPUTER' : 'PLAYER 2'}
        </p>
        <div className="flex items-center justify-center p-2 rounded-lg bg-player-o/15 min-w-[50px] min-h-[50px]">
          <span className="text-2xl font-bold text-player-o">
            {scores.player2}
          </span>
        </div>
        <div className="text-xl mt-2 font-bold text-player-o">
          O
        </div>
      </div>
    </div>
  )
})

ScoreBoard.displayName = 'ScoreBoard'

export default ScoreBoard
