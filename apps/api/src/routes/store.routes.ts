import { Router, Response } from 'express';
import { storeService } from '../services/store.service';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// Get current user's store
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(401).json({ error: 'User not associated with a store' });
            return;
        }

        const store = await storeService.findById(req.user.storeId);
        if (!store) {
            res.status(404).json({ error: 'Store not found' });
            return;
        }

        res.json(store);
    } catch (error) {
        console.error('Error fetching store:', error);
        res.status(500).json({ error: 'Failed to fetch store' });
    }
});

// Update current user's store
router.put('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(401).json({ error: 'User not associated with a store' });
            return;
        }

        const { name, address, phone, email, taxNumber, logo, currency, timezone } = req.body;

        const store = await storeService.update(req.user.storeId, {
            name,
            address,
            phone,
            email,
            taxNumber,
            logo,
            currency,
            timezone,
        });

        if (!store) {
            res.status(404).json({ error: 'Store not found' });
            return;
        }

        res.json(store);
    } catch (error) {
        console.error('Error updating store:', error);
        res.status(500).json({ error: 'Failed to update store' });
    }
});

export default router;
