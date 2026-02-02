import { Router, Response } from 'express';
import { userService } from '../services/user.service';
import { authMiddleware, AuthenticatedRequest, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Get all users in the same store (admin only)
router.get('/team', authMiddleware, requireRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.storeId) {
            res.status(400).json({ error: 'User not associated with a store' });
            return;
        }

        const users = await userService.findByStoreId(req.user.storeId);
        res.json(users);
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).json({ error: 'Failed to fetch team members' });
    }
});

// Approve a pending user (admin only)
router.put('/:id/approve', authMiddleware, requireRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Verify user is in same store
        const targetUser = await userService.findById(id);
        if (!targetUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (targetUser.storeId !== req.user?.storeId) {
            res.status(403).json({ error: 'Cannot manage users from other stores' });
            return;
        }

        const updated = await userService.updateStatus(id, 'active');
        res.json(updated);
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ error: 'Failed to approve user' });
    }
});

// Reject a pending user (admin only)
router.put('/:id/reject', authMiddleware, requireRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Verify user is in same store
        const targetUser = await userService.findById(id);
        if (!targetUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (targetUser.storeId !== req.user?.storeId) {
            res.status(403).json({ error: 'Cannot manage users from other stores' });
            return;
        }

        const updated = await userService.updateStatus(id, 'rejected');
        res.json(updated);
    } catch (error) {
        console.error('Error rejecting user:', error);
        res.status(500).json({ error: 'Failed to reject user' });
    }
});

// Remove user from store (admin only)
router.delete('/:id', authMiddleware, requireRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Verify user is in same store
        const targetUser = await userService.findById(id);
        if (!targetUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (targetUser.storeId !== req.user?.storeId) {
            res.status(403).json({ error: 'Cannot manage users from other stores' });
            return;
        }

        // Prevent admin from removing themselves
        if (targetUser.id === req.user?.id) {
            res.status(400).json({ error: 'Cannot remove yourself from the store' });
            return;
        }

        const updated = await userService.removeFromStore(id);
        res.json({ message: 'User removed from store', user: updated });
    } catch (error) {
        console.error('Error removing user:', error);
        res.status(500).json({ error: 'Failed to remove user' });
    }
});

// Complete profile for OAuth users (no role check - for incomplete profiles)
router.post('/complete-profile', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        const { role, storeName, storeAddress, storePhone, inviteCode } = req.body;

        if (!role) {
            res.status(400).json({ error: 'Role is required' });
            return;
        }

        // Validate based on role
        if (role === 'admin' && !storeName) {
            res.status(400).json({ error: 'Store name is required for admin role' });
            return;
        }

        if (role !== 'admin' && !inviteCode) {
            res.status(400).json({ error: 'Invite code is required to join a store' });
            return;
        }

        const updated = await userService.completeProfile(req.user.id, {
            role,
            storeName,
            storeAddress,
            storePhone,
            inviteCode,
        });

        res.json(updated);
    } catch (error: any) {
        console.error('Error completing profile:', error);
        res.status(400).json({ error: error.message || 'Failed to complete profile' });
    }
});

export default router;
