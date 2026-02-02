import { db } from '../config/db';
import { transactions, transactionItems, products, type NewTransaction, type NewTransactionItem } from '../db/schema/index';
import { eq, and, desc, sql, gte, lte } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { productService } from './product.service';

export interface TransactionFilters {
    storeId: string;
    page?: number;
    limit?: number;
    status?: 'pending' | 'completed' | 'cancelled' | 'refunded';
    paymentType?: 'cash' | 'card' | 'transfer';
    startDate?: Date;
    endDate?: Date;
}

export interface CreateTransactionData {
    storeId: string;
    userId: string;
    customerName?: string;
    customerPhone?: string;
    items: Array<{
        productId: string;
        quantity: number;
    }>;
    paymentType: 'cash' | 'card' | 'transfer';
    amountReceived?: number;
    discount?: number;
    notes?: string;
}

export class TransactionService {
    async findAll(filters: TransactionFilters) {
        const { storeId, page = 1, limit = 20, status, paymentType, startDate, endDate } = filters;
        const offset = (page - 1) * limit;

        const conditions = [eq(transactions.storeId, storeId)];

        if (status) conditions.push(eq(transactions.status, status));
        if (paymentType) conditions.push(eq(transactions.paymentType, paymentType));
        if (startDate) conditions.push(gte(transactions.createdAt, startDate));
        if (endDate) conditions.push(lte(transactions.createdAt, endDate));

        const result = await db
            .select()
            .from(transactions)
            .where(and(...conditions))
            .orderBy(desc(transactions.createdAt))
            .limit(limit)
            .offset(offset);

        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(transactions)
            .where(and(...conditions));

        const total = countResult[0]?.count ?? 0;

        return {
            data: result,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }

    async findById(id: string, storeId: string) {
        const transaction = await db
            .select()
            .from(transactions)
            .where(and(eq(transactions.id, id), eq(transactions.storeId, storeId)))
            .limit(1);

        if (!transaction[0]) return null;

        const items = await db
            .select()
            .from(transactionItems)
            .where(eq(transactionItems.transactionId, id));

        return { ...transaction[0], items };
    }

    async create(data: CreateTransactionData) {
        const transactionId = uuidv4();
        const transactionNumber = `TRX-${Date.now().toString(36).toUpperCase()}`;

        // Calculate totals and prepare items
        let subtotal = 0;
        const itemsToInsert: NewTransactionItem[] = [];

        for (const item of data.items) {
            const product = await productService.findById(item.productId, data.storeId);
            if (!product) throw new Error(`Product ${item.productId} not found`);

            const itemSubtotal = parseFloat(product.sellingPrice) * item.quantity;
            subtotal += itemSubtotal;

            itemsToInsert.push({
                id: uuidv4(),
                transactionId,
                productId: item.productId,
                productName: product.name,
                productSku: product.sku,
                unitPrice: product.sellingPrice,
                quantity: item.quantity,
                subtotal: itemSubtotal.toFixed(2),
            });
        }

        const discount = data.discount ?? 0;
        const total = subtotal - discount;
        const changeDue = data.amountReceived ? data.amountReceived - total : 0;

        // Insert transaction
        const [newTransaction] = await db.insert(transactions).values({
            id: transactionId,
            storeId: data.storeId,
            userId: data.userId,
            transactionNumber,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            subtotal: subtotal.toFixed(2),
            discount: discount.toFixed(2),
            total: total.toFixed(2),
            paymentType: data.paymentType,
            amountReceived: data.amountReceived?.toFixed(2),
            changeDue: changeDue.toFixed(2),
            notes: data.notes,
            status: 'completed',
        }).returning();

        // Insert transaction items
        if (itemsToInsert.length > 0) {
            await db.insert(transactionItems).values(itemsToInsert);
        }

        // Update product stock
        for (const item of data.items) {
            await productService.updateStock(item.productId, data.storeId, -item.quantity);
        }

        return { ...newTransaction, items: itemsToInsert };
    }

    async updateStatus(id: string, storeId: string, status: 'pending' | 'completed' | 'cancelled' | 'refunded') {
        const result = await db
            .update(transactions)
            .set({ status, updatedAt: new Date() })
            .where(and(eq(transactions.id, id), eq(transactions.storeId, storeId)))
            .returning();

        return result[0] ?? null;
    }

    async getRecentTransactions(storeId: string, limit = 10) {
        return db
            .select()
            .from(transactions)
            .where(eq(transactions.storeId, storeId))
            .orderBy(desc(transactions.createdAt))
            .limit(limit);
    }

    // Update status by order ID (used by Midtrans webhook)
    async updateStatusByOrderId(orderId: string, status: 'pending' | 'completed' | 'cancelled' | 'refunded') {
        // orderId from Midtrans matches our transaction ID
        const result = await db
            .update(transactions)
            .set({ status, updatedAt: new Date() })
            .where(eq(transactions.id, orderId))
            .returning();

        return result[0] ?? null;
    }
}

export const transactionService = new TransactionService();
