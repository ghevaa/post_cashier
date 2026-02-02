import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes/index';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Serve uploaded files
// NOTE: This will only work for the duration of the lambda execution on Vercel.
// Files are not persistent.
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check (no rate limit)
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root route (no rate limit)
app.get('/', (req, res) => {
    res.json({
        message: 'PostKasir API Server',
        health: '/health',
        api: '/api/v1'
    });
});

// API routes
app.use('/api/v1', routes);

// Error handling
app.use(errorMiddleware);

// Start server only if not running in Vercel (Vercel exports the app)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📚 API available at http://localhost:${PORT}/api/v1`);
    });
}

export default app;