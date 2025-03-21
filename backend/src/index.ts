import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { gameRoutes } from './routes/gameRoutes';

// Load environment
dotenv.config();

// Setup Express app
const app = express();
const PORT = process.env.PORT || 3001;
// const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

// Middleware
app.use(express.json());
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true
// }));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


// Routes
app.use('/api/games', gameRoutes);

// Health Check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
