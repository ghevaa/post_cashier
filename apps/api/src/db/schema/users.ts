import { pgTable, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { stores } from './store';

// Enums
export const roleEnum = pgEnum('user_role', ['admin', 'manager', 'cashier', 'kitchen']);
export const accessLevelEnum = pgEnum('access_level', ['admin', 'pos_only', 'kitchen_display', 'reports_only']);

// Users table
export const users = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    emailVerified: boolean('email_verified').default(false),
    image: text('image'),
    role: roleEnum('role').default('cashier'),
    accessLevel: accessLevelEnum('access_level').default('pos_only'),
    status: text('status').default('active'), // pending, active, rejected
    storeId: text('store_id').references(() => stores.id),
    // Store info fields (used during registration, then stored in the store table)
    storeName: text('store_name'),
    storeAddress: text('store_address'),
    storePhone: text('store_phone'),
    inviteCode: text('invite_code'), // Used during registration for non-admin users
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Better Auth session table
export const sessions = pgTable('sessions', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Better Auth account table (for OAuth providers)
export const accounts = pgTable('accounts', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    idToken: text('id_token'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Better Auth verification tokens
export const verifications = pgTable('verifications', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
