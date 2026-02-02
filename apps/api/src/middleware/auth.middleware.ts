import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/auth';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        accessLevel: string;
        storeId: string;
    };
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        // Convert express headers to Headers format for better-auth
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
            if (value) {
                headers.set(key, Array.isArray(value) ? value.join(', ') : value);
            }
        }

        // Debug: Log cookies received
        console.log('🔐 Auth Debug - Cookies:', req.headers.cookie);

        const session = await auth.api.getSession({ headers });

        // Debug: Log session result
        console.log('🔐 Auth Debug - Session:', session ? 'Found' : 'Not found', session?.user?.email);
        console.log('🔐 Auth Debug - User role:', (session?.user as Record<string, unknown>)?.role);
        console.log('🔐 Auth Debug - User accessLevel:', (session?.user as Record<string, unknown>)?.accessLevel);
        console.log('🔐 Auth Debug - User storeId:', (session?.user as Record<string, unknown>)?.storeId);

        if (!session?.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Map Better Auth user to our extended user type with defaults
        const betterAuthUser = session.user as Record<string, unknown>;
        req.user = {
            id: betterAuthUser.id as string,
            email: betterAuthUser.email as string,
            name: betterAuthUser.name as string,
            role: (betterAuthUser.role as string) || 'cashier',
            accessLevel: (betterAuthUser.accessLevel as string) || 'pos_only',
            storeId: (betterAuthUser.storeId as string) || '',
        };
        next();
    } catch (error) {
        console.error('🔐 Auth Debug - Error:', error);
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
}

export function requireRole(...roles: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
            return;
        }

        next();
    };
}

export function requireAccess(...levels: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!levels.includes(req.user.accessLevel) && req.user.accessLevel !== 'admin') {
            res.status(403).json({ error: 'Forbidden: Insufficient access level' });
            return;
        }

        next();
    };
}
