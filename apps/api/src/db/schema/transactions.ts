import { pgTable, text, timestamp, integer, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { stores } from './store';
import { users } from './users';
import { products } from './products';

// Enums
export const transactionStatusEnum = pgEnum('transaction_status', ['pending', 'completed', 'cancelled', 'refunded']);
export const paymentTypeEnum = pgEnum('payment_type', ['cash', 'card', 'transfer']);

// Transactions table
export const transactions = pgTable('transactions', {
    id: text('id').primaryKey(),
    storeId: text('store_id').notNull().references(() => stores.id),
    userId: text('user_id').notNull().references(() => users.id),

    // Transaction reference
    transactionNumber: text('transaction_number').notNull().unique(),

    // Customer info (optional for walk-in)
    customerName: text('customer_name'),
    customerPhone: text('customer_phone'),

    // Payment details
    subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
    tax: decimal('tax', { precision: 10, scale: 2 }).default('0'),
    discount: decimal('discount', { precision: 10, scale: 2 }).default('0'),
    total: decimal('total', { precision: 10, scale: 2 }).notNull(),

    paymentType: paymentTypeEnum('payment_type').notNull(),
    amountReceived: decimal('amount_received', { precision: 10, scale: 2 }),
    changeDue: decimal('change_due', { precision: 10, scale: 2 }),

    status: transactionStatusEnum('status').default('completed'),
    notes: text('notes'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Transaction items table
export const transactionItems = pgTable('transaction_items', {
    id: text('id').primaryKey(),
    transactionId: text('transaction_id').notNull().references(() => transactions.id, { onDelete: 'cascade' }),
    productId: text('product_id').notNull().references(() => products.id),

    // Snapshot of product at time of sale
    productName: text('product_name').notNull(),
    productSku: text('product_sku'),
    unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
    quantity: integer('quantity').notNull(),
    subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),

    createdAt: timestamp('created_at').defaultNow(),
});

// Type exports
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type TransactionItem = typeof transactionItems.$inferSelect;
export type NewTransactionItem = typeof transactionItems.$inferInsert;
