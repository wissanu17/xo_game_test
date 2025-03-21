import { Router } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';

const router = Router();

// Schema for validating game creation
const createGameSchema = z.object({
  gameType: z.enum(['onePlayer', 'twoPlayer']),
  boardSize: z.number().int().min(3).max(6),
  winner: z.enum(['player1', 'player2', 'tie']).nullable().optional(),
  player1Name: z.string().min(1).default('Player 1'),
  player2Name: z.string().min(1).optional(),
  moves: z.array(
    z.object({
      position: z.number().int().min(0),
      symbol: z.enum(['X', 'O']),
      moveOrder: z.number().int().min(1)
    })
  )
});

// Schema for validating move addition
const addMoveSchema = z.object({
  position: z.number().int().min(0),
  symbol: z.enum(['X', 'O']),
  moveOrder: z.number().int().min(1)
});

// Schema for updating game
const updateGameSchema = z.object({
  winner: z.enum(['player1', 'player2', 'tie']).nullable().optional()
});

// GET /api/games - Get all games with optional pagination
router.get('/', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { moves: { orderBy: { moveOrder: 'asc' } } }
      }),
      prisma.game.count()
    ]);

    res.json({
      games,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// GET /api/games/completed - Get all completed games
router.get('/completed', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Query all completed games directly
    const [completedGames, total] = await Promise.all([
      prisma.game.findMany({
        where: {
          winner: {
            not: null  // Only include games with a winner set
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { moves: { orderBy: { moveOrder: 'asc' } } }
      }),
      prisma.game.count({
        where: {
          winner: {
            not: null
          }
        }
      })
    ]);

    res.json({
      games: completedGames,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching completed games:', error);
    res.status(500).json({ error: 'Failed to fetch completed games' });
  }
});

// GET /api/games/unique - Get unique games (one of each session)
// router.get('/unique', async (req, res) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     // Get all completed games ordered by createdAt desc
//     const allGames = await prisma.game.findMany({
//       where: {
//         winner: {
//           not: null  // Only include games where winner is not null
//         }
//       },
//       orderBy: { createdAt: 'desc' },
//       include: {
//         moves: {
//           orderBy: { moveOrder: 'asc' },
//           take: 1
//         }
//       }
//     });
    

//     // Group games by approximate time (within 2 minutes)
//     // and player matchups to filter duplicates
//     const uniqueGames: Array<typeof allGames[0]> = [];
//     const processedGroups = new Set();

//     allGames.forEach(game => {
//       // Create a key based on players and approximate time (rounded to nearest minute)
//       const gameTime = new Date(game.createdAt);
//       // Round to nearest minute to group games started in the same minute
//       const timeKey = Math.floor(gameTime.getTime() / (1000 * 60));
//       const playerKey = `${game.player1Name}-${game.player2Name}-${game.boardSize}-${game.gameType}`;
//       const groupKey = `${playerKey}-${timeKey}`;

//       // If we haven't processed this game group yet
//       if (!processedGroups.has(groupKey)) {
//         // Prefer games with a winner or with moves over unfinished games
//         if (game.winner || game.moves.length > 0 || uniqueGames.length === 0) {
//           // Add this game and mark the group as processed
//           uniqueGames.push(game);
//           processedGroups.add(groupKey);
//         }
//       }
//     });

//     // Apply pagination to the unique games list
//     const paginatedGames = uniqueGames.slice(skip, skip + limit);
//     const total = uniqueGames.length;

//     // For each game in the paginated list, get the full moves
//     const gamesWithMoves = await Promise.all(
//       paginatedGames.map(async (game) => {
//         const fullGame = await prisma.game.findUnique({
//           where: { id: game.id },
//           include: { moves: { orderBy: { moveOrder: 'asc' } } }
//         });
//         return fullGame;
//       })
//     );

//     res.json({
//       games: gamesWithMoves,
//       pagination: {
//         total,
//         pages: Math.ceil(total / limit),
//         page,
//         limit
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching unique games:', error);
//     res.status(500).json({ error: 'Failed to fetch unique games' });
//   }
// });

// GET /api/games/:id - Get a specific game by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const game = await prisma.game.findUnique({
      where: { id },
      include: { moves: { orderBy: { moveOrder: 'asc' } } }
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

// POST /api/games - Create a new game
router.post('/', async (req, res) => {
  try {
    const validationResult = createGameSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: 'Invalid game data', details: validationResult.error });
    }

    const { moves, ...gameData } = validationResult.data;

    // Create game and moves in a transaction
    const game = await prisma.$transaction(async (prisma) => {
      // Create the game
      const newGame = await prisma.game.create({
        data: {
          ...gameData,
          // Set default Player 2 name based on game type
          player2Name: gameData.player2Name || (gameData.gameType === 'onePlayer' ? 'Computer' : 'Player 2')
        }
      });

      // Create moves if provided
      if (moves && moves.length > 0) {
        await prisma.move.createMany({
          data: moves.map(move => ({
            ...move,
            gameId: newGame.id
          }))
        });
      }

      // Return the created game with its moves
      return prisma.game.findUnique({
        where: { id: newGame.id },
        include: { moves: { orderBy: { moveOrder: 'asc' } } }
      });
    });

    res.status(201).json(game);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Failed to create game' });
  }
});

// POST /api/games/:id/moves - Add a move to an existing game
router.post('/:id/moves', async (req, res) => {
  try {
    const { id } = req.params;
    const validationResult = addMoveSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: 'Invalid move data', details: validationResult.error });
    }

    const moveData = validationResult.data;

    // Check if game exists
    const game = await prisma.game.findUnique({ where: { id } });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Add the move
    const move = await prisma.move.create({
      data: {
        ...moveData,
        gameId: id
      }
    });

    res.status(201).json(move);
  } catch (error) {
    console.error('Error adding move:', error);
    res.status(500).json({ error: 'Failed to add move' });
  }
});

// PATCH /api/games/:id - Update game data (e.g., mark as completed with winner)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validationResult = updateGameSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: 'Invalid update data', details: validationResult.error });
    }

    const updateData = validationResult.data;

    // Update the game
    const updatedGame = await prisma.game.update({
      where: { id },
      data: updateData,
      include: { moves: { orderBy: { moveOrder: 'asc' } } }
    });

    res.json(updatedGame);
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ error: 'Failed to update game' });
  }
});

// DELETE /api/games/:id - Delete a game and its moves
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if game exists
    const game = await prisma.game.findUnique({ where: { id } });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Delete the game (moves will be deleted via cascading)
    await prisma.game.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

export { router as gameRoutes };
