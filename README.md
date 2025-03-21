# Tic-Tac-Toe Project

## Setup Instruction

### Prerequisite
- Download the folder of project 
- Node.js
- MySQL database
- Bun (optional, for faster package management)

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   # or
   bun install
   ```
3. Create a `.env.local` file:
   ```
   VITE_API_URL=http://localhost:3001/api
   ```
4. Start the development server:
   ```
   npm run dev
   # or
   bun run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   # or
   bun install
   ```
3. Create a `.env` file:
   ```
   DATABASE_URL="mysql://username:password@localhost:3306/tic_tac_toe_db"
   PORT=3001
   ```
4. Run Prisma migrations:
   ```
   npx prisma migrate dev
   ```
5. Start the development server:
   ```
   npm run dev
   # or
   bun run dev
   ```

## Features

- **Single Player Mode**: Play against an AI opponent with Monte Carlo Tree Search algorithm
- **Two Player Mode**: Play locally against a friend
- **Adjustable Board Size**: Play on 3×3, 4×4, 5×5, or 6×6 grids
- **Game History**: Save all your games to the database
- **Game Replay**: Watch replays of past games move by move and can delete history

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS**: For styling

### Backend
- **Express.js** web server
- **Prisma ORM** for database interactions
- **MySQL** database for game storage
- **TypeScript** for type safety
- **Zod** for request validation

## Database Schema

The database revolves around two main models:

### Game Model
- Game metadata (id, creation time, type, board size)
- Player information (player names)
- Game outcome (winner)
- Relationship to moves

### Move Model
- Position on the board
- Symbol placed (X or O)
- Move order
- Reference to parent game

## API Endpoints

### Game Management
- `GET /api/games`: Get all games with pagination
- `GET /api/games/completed`: Get all completed games
- `GET /api/games/:id`: Get details of a specific game
- `POST /api/games`: Create a new game
- `PATCH /api/games/:id`: Update game (e.g., set winner)
- `DELETE /api/games/:id`: Delete a game

### Move Management
- `POST /api/games/:id/moves`: Add a move to a game

## Game AI

The computer opponent uses the Monte Carlo Tree Search (MCTS) algorithm to determine optimal moves:

1. **Selection**: Navigate from the root node to a leaf node using the UCB1 formula
2. **Expansion**: Add one or more child nodes to the leaf node
3. **Simulation**: Perform a random playout from the new node
4. **Backpropagation**: Update node statistics based on the playout result


## Data Flow

1. **Game Creation**:
   - User starts a new game in the frontend
   - Frontend calls the backend to create a game record
   - Backend returns a game ID used for subsequent requests

2. **Game Play**:
   - Each move is sent to the backend and stored
   - Game state is maintained on both frontend and backend
   - When game ends, winner is saved to the backend

3. **Game Replay**:
   - Frontend fetches list of completed games
   - User selects a game to replay
   - Frontend fetches the complete game with all its moves
   - Moves are played back in sequence on the board


