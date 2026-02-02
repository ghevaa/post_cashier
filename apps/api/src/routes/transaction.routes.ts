import { Router, Response } from 'express';
import { transactionService } from '../services/transaction.service';
import { authMiddleware, requireRole, type AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET /transactions - List all transactions
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }

        const { page, limit, status, paymentType, startDate, endDate } = req.query;

        const result = await transactionService.findAll({
            storeId: req.user.storeId,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            status: status as 'pending' | 'completed' | 'cancelled' | 'refunded',
            paymentType: paymentType as 'cash' | 'card' | 'transfer',
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// GET /transactions/:id
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const transaction = await transactionService.findById(req.params.id, req.user.storeId);
        if (!transaction) {
            res.status(404).json({ error: 'Transaction not found' });
            return;
        }
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transaction' });
    }
});

// POST /transactions - Create new transaction (checkout)
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId || !req.user?.id) {
            res.status(400).json({ error: 'Store ID and User ID required' });
            return;
        }
        const transaction = await transactionService.create({
            ...req.body,
            storeId: req.user.storeId,
            userId: req.user.id,
        });
        res.status(201).json(transaction);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create transaction';
        res.status(400).json({ error: message });
    }
});

// PUT /transactions/:id/status - Update transaction status
router.put('/:id/status', requireRole('admin', 'manager'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const { status } = req.body;
        const transaction = await transactionService.updateStatus(req.params.id, req.user.storeId, status);
        if (!transaction) {
            res.status(404).json({ error: 'Transaction not found' });
            return;
        }
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update transaction' });
    }
});

export default router;
