import { Router, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { transactionService } from '../services/transaction.service';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET /dashboard/stats - Get dashboard statistics
router.get('/stats', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const stats = await dashboardService.getStats(req.user.storeId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});

// GET /dashboard/sales-chart - Get sales chart data
router.get('/sales-chart', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const { days } = req.query;
        const salesData = await dashboardService.getSalesChart(
            req.user.storeId,
            days ? parseInt(days as string) : 7
        );
        res.json(salesData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sales chart data' });
    }
});

// GET /dashboard/recent-transactions - Get recent transactions
router.get('/recent-transactions', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const { limit } = req.query;
        const transactions = await transactionService.getRecentTransactions(
            req.user.storeId,
            limit ? parseInt(limit as string) : 10
        );
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recent transactions' });
    }
});

// GET /dashboard/reports-stats - Get reports statistics for a date range
router.get('/reports-stats', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate as string) : (() => {
            const d = new Date();
            d.setDate(d.getDate() - 30);
            d.setHours(0, 0, 0, 0);
            return d;
        })();
        const end = endDate ? new Date(endDate as string) : new Date();

        const stats = await dashboardService.getReportsStats(req.user.storeId, start, end);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reports stats' });
    }
});

// GET /dashboard/best-selling - Get best selling products
router.get('/best-selling', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const { startDate, endDate, limit } = req.query;

        const start = startDate ? new Date(startDate as string) : (() => {
            const d = new Date();
            d.setDate(d.getDate() - 30);
            d.setHours(0, 0, 0, 0);
            return d;
        })();
        const end = endDate ? new Date(endDate as string) : new Date();

        const products = await dashboardService.getBestSellingProducts(
            req.user.storeId,
            start,
            end,
            limit ? parseInt(limit as string) : 10
        );
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch best selling products' });
    }
});

export default router;
