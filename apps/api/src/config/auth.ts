import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware } from 'better-auth/api';
import { db } from './db';
import * as schema from '../db/schema';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

// Generate 8-character invite code
function generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Map role to access level
function getAccessLevelForRole(role: string): 'admin' | 'pos_only' | 'kitchen_display' | 'reports_only' {
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

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: schema,
        usePlural: true,
    }),
    basePath: '/api/v1/auth',
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5, // 5 minutes cache
        },
    },
    advanced: {
        cookiePrefix: 'postkasir',
        crossSubDomainCookies: {
            enabled: false,
        },
        defaultCookieAttributes: {
            // For cross-origin (Vercel frontend -> Railway backend), use 'none' in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Must be true when sameSite is 'none'
            path: '/',
        },
    },
    trustedOrigins: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'http://192.168.1.13:5173', // Local network access for mobile testing
    ],
    user: {
        additionalFields: {
            role: {
                type: 'string',
                required: false,
                defaultValue: 'cashier',
                input: true,
            },
            accessLevel: {
                type: 'string',
                required: false,
                defaultValue: 'pos_only',
                input: false,
            },
            storeId: {
                type: 'string',
                required: false,
                input: false,
            },
            status: {
                type: 'string',
                required: false,
                defaultValue: 'active',
                input: false,
            },
            // Store info fields (only for admin registration)
            storeName: {
                type: 'string',
                required: false,
                input: true,
            },
            storeAddress: {
                type: 'string',
                required: false,
                input: true,
            },
            storePhone: {
                type: 'string',
                required: false,
                input: true,
            },
            // Invite code for manager/cashier to join a store
            inviteCode: {
                type: 'string',
                required: false,
                input: true,
            },
        },
    },
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            // Handle post-signup logic
            if (ctx.path.startsWith('/sign-up')) {
                const newSession = ctx.context.newSession;
                if (newSession) {
                    try {
                        const user = newSession.user;
                        const userRole = (user as any).role || 'cashier';
                        const accessLevel = getAccessLevelForRole(userRole);

                        if (userRole === 'admin') {
                            // Admin: Create a new store with invite code
                            const storeId = nanoid();
                            const inviteCode = generateInviteCode();
                            const storeName = (user as any).storeName || `${user.name}'s Store`;
                            const storeAddress = (user as any).storeAddress || null;
                            const storePhone = (user as any).storePhone || null;

                            await db.insert(schema.stores).values({
                                id: storeId,
                                name: storeName,
                                address: storeAddress,
                                phone: storePhone,
                                inviteCode: inviteCode,
                                currency: 'IDR',
                                timezone: 'Asia/Jakarta',
                            });

                            // Update user with store ID, access level, and active status
                            await db.update(schema.users)
                                .set({
                                    storeId: storeId,
                                    accessLevel: accessLevel,
                                    status: 'active',
                                })
                                .where(eq(schema.users.id, user.id));

                            console.log(`✅ Created store "${storeName}" (${storeId}) with invite code: ${inviteCode} for admin ${user.email}`);
                        } else {
                            // Manager/Cashier: Join existing store via invite code
                            const inviteCode = (user as any).inviteCode;

                            if (!inviteCode) {
                                console.error(`❌ No invite code provided for ${userRole} ${user.email}`);
                                // Still allow registration but without store
                                await db.update(schema.users)
                                    .set({ accessLevel: accessLevel })
                                    .where(eq(schema.users.id, user.id));
                                return;
                            }

                            // Find store by invite code
                            const [store] = await db.select()
                                .from(schema.stores)
                                .where(eq(schema.stores.inviteCode, inviteCode))
                                .limit(1);

                            if (!store) {
                                console.error(`❌ Invalid invite code "${inviteCode}" for ${userRole} ${user.email}`);
                                // Still allow registration but without store
                                await db.update(schema.users)
                                    .set({ accessLevel: accessLevel })
                                    .where(eq(schema.users.id, user.id));
                                return;
                            }

                            // Update user with store ID and pending status (needs admin approval)
                            await db.update(schema.users)
                                .set({
                                    storeId: store.id,
                                    accessLevel: accessLevel,
                                    status: 'pending', // Needs admin approval
                                })
                                .where(eq(schema.users.id, user.id));

                            console.log(`✅ ${userRole} ${user.email} joined store "${store.name}" with PENDING status (awaiting admin approval)`);
                        }
                    } catch (error) {
                        console.error('❌ Failed to process registration:', error);
                    }
                }
            }
        }),
    },
});

