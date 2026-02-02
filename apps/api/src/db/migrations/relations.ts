import { relations } from "drizzle-orm/relations";
import { stores, printerConfigs, users, accounts, sessions, brands, categories, suppliers, paymentMethods, products, transactions, transactionItems } from "./schema";

export const printerConfigsRelations = relations(printerConfigs, ({one}) => ({
	store: one(stores, {
		fields: [printerConfigs.storeId],
		references: [stores.id]
	}),
}));

export const storesRelations = relations(stores, ({many}) => ({
	printerConfigs: many(printerConfigs),
	users: many(users),
	brands: many(brands),
	categories: many(categories),
	suppliers: many(suppliers),
	paymentMethods: many(paymentMethods),
	products: many(products),
	transactions: many(transactions),
}));

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	accounts: many(accounts),
	sessions: many(sessions),
	store: one(stores, {
		fields: [users.storeId],
		references: [stores.id]
	}),
	transactions: many(transactions),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const brandsRelations = relations(brands, ({one, many}) => ({
	store: one(stores, {
		fields: [brands.storeId],
		references: [stores.id]
	}),
	products: many(products),
}));

export const categoriesRelations = relations(categories, ({one, many}) => ({
	store: one(stores, {
		fields: [categories.storeId],
		references: [stores.id]
	}),
	products: many(products),
}));

export const suppliersRelations = relations(suppliers, ({one, many}) => ({
	store: one(stores, {
		fields: [suppliers.storeId],
		references: [stores.id]
	}),
	products: many(products),
}));

export const paymentMethodsRelations = relations(paymentMethods, ({one}) => ({
	store: one(stores, {
		fields: [paymentMethods.storeId],
		references: [stores.id]
	}),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	brand: one(brands, {
		fields: [products.brandId],
		references: [brands.id]
	}),
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id]
	}),
	store: one(stores, {
		fields: [products.storeId],
		references: [stores.id]
	}),
	supplier: one(suppliers, {
		fields: [products.supplierId],
		references: [suppliers.id]
	}),
	transactionItems: many(transactionItems),
}));

export const transactionsRelations = relations(transactions, ({one, many}) => ({
	store: one(stores, {
		fields: [transactions.storeId],
		references: [stores.id]
	}),
	user: one(users, {
		fields: [transactions.userId],
		references: [users.id]
	}),
	transactionItems: many(transactionItems),
}));

export const transactionItemsRelations = relations(transactionItems, ({one}) => ({
	product: one(products, {
		fields: [transactionItems.productId],
		references: [products.id]
	}),
	transaction: one(transactions, {
		fields: [transactionItems.transactionId],
		references: [transactions.id]
	}),
}));