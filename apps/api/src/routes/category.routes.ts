import { Router, Response } from 'express';
import { categoryService } from '../services/category.service';
import { authMiddleware, requireRole, type AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /categories - List all categories
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }

        const { search } = req.query;
        const result = await categoryService.findAll(
            req.user.storeId,
            search as string
        );

        res.json(result);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// GET /categories/:id - Get single category
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const category = await categoryService.findById(req.params.id, req.user.storeId);
        if (!category) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch category' });
    }
});

// POST /categories - Create new category
router.post('/', requireRole('admin', 'manager'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }

        const { name, description, color } = req.body;

        if (!name) {
            res.status(400).json({ error: 'Category name is required' });
            return;
        }

        const category = await categoryService.create({
            storeId: req.user.storeId,
            name,
            description,
            color,
        });
        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// PUT /categories/:id - Update category
router.put('/:id', requireRole('admin', 'manager'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const category = await categoryService.update(req.params.id, req.user.storeId, req.body);
        if (!category) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// DELETE /categories/:id - Delete category
router.delete('/:id', requireRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const category = await categoryService.delete(req.params.id, req.user.storeId);
        if (!category) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

export default router;
