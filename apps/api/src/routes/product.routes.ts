import { Router, Response } from 'express';
import { productService } from '../services/product.service';
import { authMiddleware, requireRole, type AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /products - List all products (paginated)
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }

        const { page, limit, search, categoryId, status, sortBy, sortOrder } = req.query;

        const result = await productService.findAll({
            storeId: req.user.storeId,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            search: search as string,
            categoryId: categoryId as string,
            status: status as 'in_stock' | 'low_stock' | 'out_of_stock',
            sortBy: sortBy as 'name' | 'stock' | 'price' | 'createdAt',
            sortOrder: sortOrder as 'asc' | 'desc',
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET /products/low-stock - Get low stock products
router.get('/low-stock', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const products = await productService.getLowStock(req.user.storeId);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch low stock products' });
    }
});

// GET /products/:id - Get single product
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const product = await productService.findById(req.params.id, req.user.storeId);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// POST /products - Create new product (admin/manager only)
router.post('/', requireRole('admin', 'manager'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const product = await productService.create({
            ...req.body,
            storeId: req.user.storeId,
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// PUT /products/:id - Update product (admin/manager only)
router.put('/:id', requireRole('admin', 'manager'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const product = await productService.update(req.params.id, req.user.storeId, req.body);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// DELETE /products/:id - Delete product (admin only)
router.delete('/:id', requireRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'Store ID required' });
            return;
        }
        const product = await productService.delete(req.params.id, req.user.storeId);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

export default router;
