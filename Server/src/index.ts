import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db.js';
import routes from './routes.js';

// print("Debugging")

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize database
initializeDatabase();

// Middleware
app.use(cors({
  origin: "https://helpdesk-tre2.onrender.com" // your deployed client URL
}));

app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
  console.log(`📊 API available at :${PORT}/api`);
});