import { db } from '../config/db';
import { users } from '../db/schema/index';
import { eq, and, ne } from 'drizzle-orm';

export class UserService {
    // Get all users in the same store (for admin team management)
    async findByStoreId(storeId: string) {
        const result = await db
            .select({
                id: users.id,
                email: users.email,
                name: users.name,
                role: users.role,
                accessLevel: users.accessLevel,
                status: users.status,
                image: users.image,
                createdAt: users.createdAt,
            })
            .from(users)
            .where(eq(users.storeId, storeId))
            .orderBy(users.createdAt);

        return result;
    }

    // Update user status (approve/reject)
    async updateStatus(userId: string, status: 'pending' | 'active' | 'rejected') {
        const result = await db
            .update(users)
            .set({ status, updatedAt: new Date() })
            .where(eq(users.id, userId))
            .returning();

        return result[0] ?? null;
    }

    // Remove user from store
    async removeFromStore(userId: string) {
        const result = await db
            .update(users)
            .set({
                storeId: null,
                status: 'rejected',
                updatedAt: new Date()
            })
            .where(eq(users.id, userId))
            .returning();

        return result[0] ?? null;
    }

    // Get user by ID
    async findById(userId: string) {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        return result[0] ?? null;
    }

    // Complete profile for OAuth users
    async completeProfile(userId: string, data: {
        role: string;
        storeName?: string;
        storeAddress?: string;
        storePhone?: string;
        inviteCode?: string;
    }) {
        const { role, storeName, storeAddress, storePhone, inviteCode } = data;
        const accessLevel = this.getAccessLevelForRole(role);

        if (role === 'admin') {
            // Import stores and nanoid for creating new store
            const { stores } = await import('../db/schema/index');
            const { nanoid } = await import('nanoid');

            // Generate invite code for the new store
            const storeInviteCode = this.generateInviteCode();
            const storeId = nanoid();

            // Create new store
            await db.insert(stores).values({
                id: storeId,
                name: storeName || 'My Store',
                address: storeAddress || null,
                phone: storePhone || null,
                inviteCode: storeInviteCode,
                currency: 'IDR',
                timezone: 'Asia/Jakarta',
            });

            // Update user with store ID, role, access level, and active status
            const result = await db
                .update(users)
                .set({
                    role,
                    accessLevel,
                    storeId,
                    status: 'active',
                    updatedAt: new Date(),
                })
                .where(eq(users.id, userId))
                .returning();

            console.log(`✅ Created store "${storeName}" (${storeId}) with invite code: ${storeInviteCode} for OAuth admin`);
            return result[0] ?? null;
        } else {
            // Manager/Cashier - join existing store via invite code
            const { stores } = await import('../db/schema/index');

            const [store] = await db.select()
                .from(stores)
                .where(eq(stores.inviteCode, inviteCode!))
                .limit(1);

            if (!store) {
                throw new Error('Invalid invite code');
            }

            // Update user with store ID, role, access level, and pending status
            const result = await db
                .update(users)
                .set({
                    role,
                    accessLevel,
                    storeId: store.id,
                    status: 'pending', // Needs admin approval
                    updatedAt: new Date(),
                })
                .where(eq(users.id, userId))
                .returning();

            console.log(`✅ OAuth ${role} joined store "${store.name}" with PENDING status`);
            return result[0] ?? null;
        }
    }

    // Helper: Generate 8-character invite code
    private generateInviteCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    // Helper: Map role to access level
    private getAccessLevelForRole(role: string): 'admin' | 'pos_only' | 'kitchen_display' | 'reports_only' {
        switch (role) {
            case 'admin':
                return 'admin';
            case 'manager':
                return 'reports_only';
            case 'kitchen':
                return 'kitchen_display';
            case 'cashier':
            default:
                return 'pos_only';
        }
    }
}

export const userService = new UserService();
