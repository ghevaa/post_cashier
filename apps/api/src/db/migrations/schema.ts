import { pgTable, foreignKey, text, boolean, timestamp, unique, jsonb, numeric, integer, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const accessLevel = pgEnum("access_level", ['admin', 'pos_only', 'kitchen_display', 'reports_only'])
export const paymentType = pgEnum("payment_type", ['cash', 'card', 'transfer'])
export const stockStatus = pgEnum("stock_status", ['in_stock', 'low_stock', 'out_of_stock'])
export const supplierCategory = pgEnum("supplier_category", ['packaging', 'ingredients', 'equipment', 'other'])
export const supplierStatus = pgEnum("supplier_status", ['active', 'inactive'])
export const transactionStatus = pgEnum("transaction_status", ['pending', 'completed', 'cancelled', 'refunded'])
export const unit = pgEnum("unit", ['pcs', 'kg', 'g', 'l', 'ml', 'pack'])
export const userRole = pgEnum("user_role", ['admin', 'manager', 'cashier', 'kitchen'])


export const printerConfigs = pgTable("printer_configs", {
	id: text().primaryKey().notNull(),
	storeId: text("store_id").notNull(),
	name: text().notNull(),
	type: text().notNull(),
	connectionType: text("connection_type"),
	address: text(),
	isDefault: boolean("is_default").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.storeId],
			foreignColumns: [stores.id],
			name: "printer_configs_store_id_stores_id_fk"
		}).onDelete("cascade"),
]);

export const stores = pgTable("stores", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	address: text(),
	phone: text(),
	email: text(),
	taxNumber: text("tax_number"),
	logo: text(),
	currency: text().default('USD'),
	timezone: text().default('UTC'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const accounts = pgTable("accounts", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	idToken: text("id_token"),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const sessions = pgTable("sessions", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	token: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("sessions_token_unique").on(table.token),
]);

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	name: text().notNull(),
	emailVerified: boolean("email_verified").default(false),
	image: text(),
	role: userRole().default('cashier'),
	accessLevel: accessLevel("access_level").default('pos_only'),
	storeId: text("store_id"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.storeId],
			foreignColumns: [stores.id],
			name: "users_store_id_stores_id_fk"
		}),
	unique("users_email_unique").on(table.email),
]);

export const verifications = pgTable("verifications", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const brands = pgTable("brands", {
	id: text().primaryKey().notNull(),
	storeId: text("store_id").notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.storeId],
			foreignColumns: [stores.id],
			name: "brands_store_id_stores_id_fk"
		}).onDelete("cascade"),
]);

export const categories = pgTable("categories", {
	id: text().primaryKey().notNull(),
	storeId: text("store_id").notNull(),
	name: text().notNull(),
	description: text(),
	color: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.storeId],
			foreignColumns: [stores.id],
			name: "categories_store_id_stores_id_fk"
		}).onDelete("cascade"),
]);

export const suppliers = pgTable("suppliers", {
	id: text().primaryKey().notNull(),
	storeId: text("store_id").notNull(),
	name: text().notNull(),
	contactPerson: text("contact_person"),
	phone: text(),
	email: text(),
	address: text(),
	category: supplierCategory(),
	status: supplierStatus().default('active'),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.storeId],
			foreignColumns: [stores.id],
			name: "suppliers_store_id_stores_id_fk"
		}).onDelete("cascade"),
]);

export const paymentMethods = pgTable("payment_methods", {
	id: text().primaryKey().notNull(),
	storeId: text("store_id").notNull(),
	name: text().notNull(),
	isEnabled: boolean("is_enabled").default(true),
	config: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.storeId],
			foreignColumns: [stores.id],
			name: "payment_methods_store_id_stores_id_fk"
		}).onDelete("cascade"),
]);

export const products = pgTable("products", {
	id: text().primaryKey().notNull(),
	storeId: text("store_id").notNull(),
	name: text().notNull(),
	sku: text(),
	barcode: text(),
	description: text(),
	image: text(),
	categoryId: text("category_id"),
	brandId: text("brand_id"),
	supplierId: text("supplier_id"),
	costPrice: numeric("cost_price", { precision: 10, scale:  2 }),
	sellingPrice: numeric("selling_price", { precision: 10, scale:  2 }).notNull(),
	unit: unit().default('pcs'),
	stock: integer().default(0),
	minStockAlert: integer("min_stock_alert").default(10),
	stockStatus: stockStatus("stock_status").default('in_stock'),
	wholesaleEnabled: boolean("wholesale_enabled").default(false),
	wholesaleMinQty: integer("wholesale_min_qty"),
	wholesalePrice: numeric("wholesale_price", { precision: 10, scale:  2 }),
	expirationDate: timestamp("expiration_date", { mode: 'string' }),
	batchNumber: text("batch_number"),
	allergens: text(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brands.id],
			name: "products_brand_id_brands_id_fk"
		}),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "products_category_id_categories_id_fk"
		}),
	foreignKey({
			columns: [table.storeId],
			foreignColumns: [stores.id],
			name: "products_store_id_stores_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.supplierId],
			foreignColumns: [suppliers.id],
			name: "products_supplier_id_suppliers_id_fk"
		}),
]);

export const transactions = pgTable("transactions", {
	id: text().primaryKey().notNull(),
	storeId: text("store_id").notNull(),
	userId: text("user_id").notNull(),
	transactionNumber: text("transaction_number").notNull(),
	customerName: text("customer_name"),
	customerPhone: text("customer_phone"),
	subtotal: numeric({ precision: 10, scale:  2 }).notNull(),
	tax: numeric({ precision: 10, scale:  2 }).default('0'),
	discount: numeric({ precision: 10, scale:  2 }).default('0'),
	total: numeric({ precision: 10, scale:  2 }).notNull(),
	paymentType: paymentType("payment_type").notNull(),
	amountReceived: numeric("amount_received", { precision: 10, scale:  2 }),
	changeDue: numeric("change_due", { precision: 10, scale:  2 }),
	status: transactionStatus().default('completed'),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.storeId],
			foreignColumns: [stores.id],
			name: "transactions_store_id_stores_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "transactions_user_id_users_id_fk"
		}),
	unique("transactions_transaction_number_unique").on(table.transactionNumber),
]);

export const transactionItems = pgTable("transaction_items", {
	id: text().primaryKey().notNull(),
	transactionId: text("transaction_id").notNull(),
	productId: text("product_id").notNull(),
	productName: text("product_name").notNull(),
	productSku: text("product_sku"),
	unitPrice: numeric("unit_price", { precision: 10, scale:  2 }).notNull(),
	quantity: integer().notNull(),
	subtotal: numeric({ precision: 10, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "transaction_items_product_id_products_id_fk"
		}),
	foreignKey({
			columns: [table.transactionId],
			foreignColumns: [transactions.id],
			name: "transaction_items_transaction_id_transactions_id_fk"
		}).onDelete("cascade"),
]);
