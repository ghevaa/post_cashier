import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { stores } from './store';

// Enums
export const supplierCategoryEnum = pgEnum('supplier_category', ['packaging', 'ingredients', 'equipment', 'other']);
export const supplierStatusEnum = pgEnum('supplier_status', ['active', 'inactive']);

// Suppliers table
export const suppliers = pgTable('suppliers', {
    id: text('id').primaryKey(),
    storeId: text('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    contactPerson: text('contact_person'),
    phone: text('phone'),
    email: text('email'),
    address: text('address'),
    category: supplierCategoryEnum('category'),
    status: supplierStatusEnum('status').default('active'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Type exports
export type Supplier = typeof suppliers.$inferSelect;
export type NewSupplier = typeof suppliers.$inferInsert;
