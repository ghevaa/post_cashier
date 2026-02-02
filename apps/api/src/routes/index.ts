import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import supplierRoutes from './supplier.routes';
import transactionRoutes from './transaction.routes';
import dashboardRoutes from './dashboard.routes';
import uploadRoutes from './upload.routes';
import categoryRoutes from './category.routes';
import storeRoutes from './store.routes';
import userRoutes from './user.routes';
import paymentRoutes from './payment.routes';

const router = Router();

// Root API info
router.get('/', (req, res) => {
    res.json({
        name: 'PostKasir API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/v1/auth',
            products: '/api/v1/products',
            suppliers: '/api/v1/suppliers',
            transactions: '/api/v1/transactions',
            dashboard: '/api/v1/dashboard',
            upload: '/api/v1/upload',
        }
    });
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/transactions', transactionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/upload', uploadRoutes);
router.use('/categories', categoryRoutes);
router.use('/stores', storeRoutes);
router.use('/users', userRoutes);
router.use('/payments', paymentRoutes);

export default router;
