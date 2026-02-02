import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

// Stores table
export const stores = pgTable('stores', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    address: text('address'),
    phone: text('phone'),
    email: text('email'),
    taxNumber: text('tax_number'),
    logo: text('logo'),
    inviteCode: text('invite_code').unique(), // Code for managers/cashiers to join this store
    currency: text('currency').default('USD'),
    timezone: text('timezone').default('UTC'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Payment methods configuration
export const paymentMethods = pgTable('payment_methods', {
    id: text('id').primaryKey(),
    storeId: text('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
    name: text('name').notNull(), // Cash, Card, Transfer
    isEnabled: boolean('is_enabled').default(true),
    config: jsonb('config'), // For card/transfer provider settings
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Printer configurations
export const printerConfigs = pgTable('printer_configs', {
    id: text('id').primaryKey(),
    storeId: text('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    type: text('type').notNull(), // thermal, regular
    connectionType: text('connection_type'), // usb, network, bluetooth
    address: text('address'), // IP or device path
    isDefault: boolean('is_default').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Type exports
export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type PrinterConfig = typeof printerConfigs.$inferSelect;
