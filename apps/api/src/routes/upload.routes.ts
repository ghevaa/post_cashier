import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware, requireRole, type AuthenticatedRequest } from '../middleware/auth.middleware';
import { db } from '../config/db';
import { users } from '../db/schema/index';
import { eq } from 'drizzle-orm';

const router = Router();

// Ensure uploads directories exist
const productUploadsDir = path.join(process.cwd(), 'uploads', 'products');
const profileUploadsDir = path.join(process.cwd(), 'uploads', 'profiles');

if (!fs.existsSync(productUploadsDir)) {
    fs.mkdirSync(productUploadsDir, { recursive: true });
}
if (!fs.existsSync(profileUploadsDir)) {
    fs.mkdirSync(profileUploadsDir, { recursive: true });
}

// Configure multer for product images
const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, productUploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure multer for profile images
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profileUploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images only
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
};

const productUpload = multer({
    storage: productStorage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

const profileUpload = multer({
    storage: profileStorage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit for profile pictures
    }
});

// All routes require authentication
router.use(authMiddleware);

// POST /upload/product-image - Upload a product image
router.post('/product-image', requireRole('admin', 'manager'), productUpload.single('image'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No image file provided' });
            return;
        }

        // Return the file path that can be stored in the database
        const imageUrl = `/uploads/products/${req.file.filename}`;

        res.json({
            url: imageUrl,
            filename: req.file.filename,
            originalname: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// DELETE /upload/product-image/:filename - Delete a product image
router.delete('/product-image/:filename', requireRole('admin', 'manager'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(productUploadsDir, filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

// POST /upload/profile-image - Upload a profile picture
router.post('/profile-image', profileUpload.single('image'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No image file provided' });
            return;
        }

        if (!req.user?.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const imageUrl = `/uploads/profiles/${req.file.filename}`;

        // Update user's image in database
        await db.update(users)
            .set({ image: imageUrl, updatedAt: new Date() })
            .where(eq(users.id, req.user.id));

        res.json({
            url: imageUrl,
            filename: req.file.filename,
            originalname: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        console.error('Profile upload error:', error);
        res.status(500).json({ error: 'Failed to upload profile image' });
    }
});

// DELETE /upload/profile-image - Delete current user's profile image
router.delete('/profile-image', async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Get current user's image
        const result = await db.select({ image: users.image }).from(users).where(eq(users.id, req.user.id)).limit(1);
        const currentImage = result[0]?.image;

        if (currentImage && currentImage.startsWith('/uploads/profiles/')) {
            const filename = currentImage.replace('/uploads/profiles/', '');
            const filePath = path.join(profileUploadsDir, filename);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Clear image in database
        await db.update(users)
            .set({ image: null, updatedAt: new Date() })
            .where(eq(users.id, req.user.id));

        res.json({ message: 'Profile image deleted successfully' });
    } catch (error) {
        console.error('Delete profile image error:', error);
        res.status(500).json({ error: 'Failed to delete profile image' });
    }
});

export default router;
