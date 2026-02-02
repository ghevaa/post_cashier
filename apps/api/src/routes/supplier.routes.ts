import { Router, Response } from 'express';
import { supplierService } from '../services/supplier.service';
import { authMiddleware, requireRole, type AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET /suppliers - List all suppliers
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }

        const { page, limit, search, category, status } = req.query;

        const result = await supplierService.findAll({
            storeId: req.user.storeId,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            search: search as string,
            category: category as 'packaging' | 'ingredients' | 'equipment' | 'other',
            status: status as 'active' | 'inactive',
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch suppliers' });
    }
});

// GET /suppliers/:id
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const supplier = await supplierService.findById(req.params.id, req.user.storeId);
        if (!supplier) {
            res.status(404).json({ error: 'Supplier not found' });
            return;
        }
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch supplier' });
    }
});

// POST /suppliers
router.post('/', requireRole('admin', 'manager'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const supplier = await supplierService.create({
            ...req.body,
            storeId: req.user.storeId,
        });
        res.status(201).json(supplier);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create supplier' });
    }
});

// PUT /suppliers/:id
router.put('/:id', requireRole('admin', 'manager'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const supplier = await supplierService.update(req.params.id, req.user.storeId, req.body);
        if (!supplier) {
            res.status(404).json({ error: 'Supplier not found' });
            return;
        }
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update supplier' });
    }
});

// DELETE /suppliers/:id
router.delete('/:id', requireRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const supplier = await supplierService.delete(req.params.id, req.user.storeId);
        if (!supplier) {
            res.status(404).json({ error: 'Supplier not found' });
            return;
        }
        res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete supplier' });
    }
});

export default router;
