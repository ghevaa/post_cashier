import { pgTable, text, timestamp, integer, decimal, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { stores } from './store';
import { suppliers } from './suppliers';

// Enums
export const stockStatusEnum = pgEnum('stock_status', ['in_stock', 'low_stock', 'out_of_stock']);
export const unitEnum = pgEnum('unit', ['pcs', 'kg', 'g', 'l', 'ml', 'pack']);

// Categories table
export const categories = pgTable('categories', {
    id: text('id').primaryKey(),
    storeId: text('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    color: text('color'), // For UI badge colors
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Brands table
export const brands = pgTable('brands', {
    id: text('id').primaryKey(),
    storeId: text('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Products table
export const products = pgTable('products', {
    id: text('id').primaryKey(),
    storeId: text('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    sku: text('sku'),
    barcode: text('barcode'),
    description: text('description'),
    image: text('image'),

    // Categorization
    categoryId: text('category_id').references(() => categories.id),
    brandId: text('brand_id').references(() => brands.id),
    supplierId: text('supplier_id').references(() => suppliers.id),

    // Pricing
    costPrice: decimal('cost_price', { precision: 10, scale: 2 }),
    sellingPrice: decimal('selling_price', { precision: 10, scale: 2 }).notNull(),
    unit: unitEnum('unit').default('pcs'),

    // Stock
    stock: integer('stock').default(0),
    minStockAlert: integer('min_stock_alert').default(10),
    stockStatus: stockStatusEnum('stock_status').default('in_stock'),

    // Wholesale pricing
    wholesaleEnabled: boolean('wholesale_enabled').default(false),
    wholesaleMinQty: integer('wholesale_min_qty'),
    wholesalePrice: decimal('wholesale_price', { precision: 10, scale: 2 }),

    // Baking-specific fields
    expirationDate: timestamp('expiration_date'),
    batchNumber: text('batch_number'),
    allergens: text('allergens'),

    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Type exports
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
