import { Router, Response, Request } from 'express';
import { paymentService } from '../services/payment.service';
import { transactionService } from '../services/transaction.service';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// Get Midtrans client key (public endpoint)
router.get('/config', (req: Request, res: Response) => {
    res.json({
        clientKey: paymentService.getClientKey(),
        isProduction: paymentService.isProduction(),
    });
});

// Create Snap token for a transaction
router.post('/snap-token', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { orderId, grossAmount, items, customer } = req.body;

        if (!orderId || !grossAmount || !items) {
            res.status(400).json({ error: 'orderId, grossAmount, and items are required' });
            return;
        }

        const result = await paymentService.createSnapToken({
            orderId,
            grossAmount,
            items,
            customer,
        });

        res.json(result);
    } catch (error) {
        console.error('Error creating snap token:', error);
        res.status(500).json({ error: 'Failed to create payment token' });
    }
});

// Midtrans notification webhook (no auth - called by Midtrans)
router.post('/notification', async (req: Request, res: Response) => {
    try {
        console.log('📥 Received Midtrans notification:', req.body);

        const notification = await paymentService.handleNotification(req.body);

        // Update transaction status based on payment status
        if (notification.orderId) {
            // Extract store ID from order ID if encoded (format: STORE_TIMESTAMP_RANDOM)
            // Otherwise, we need to look up the transaction
            await transactionService.updateStatusByOrderId(
                notification.orderId,
                notification.paymentStatus
            );

            console.log(`✅ Updated transaction ${notification.orderId} to ${notification.paymentStatus}`);
        }

        res.status(200).json({ message: 'Notification processed' });
    } catch (error) {
        console.error('Error processing notification:', error);
        // Always return 200 to Midtrans even on error to prevent retries
        res.status(200).json({ message: 'Notification received' });
    }
});

// Check payment status
router.get('/:orderId/status', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { orderId } = req.params;
        const status = await paymentService.checkStatus(orderId);
        res.json(status);
    } catch (error) {
        console.error('Error checking payment status:', error);
        res.status(500).json({ error: 'Failed to check payment status' });
    }
});

export default router;
