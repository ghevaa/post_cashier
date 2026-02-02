import { db } from '../config/db';
import { suppliers, type NewSupplier } from '../db/schema/index';
import { eq, and, like, desc, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export interface SupplierFilters {
    storeId: string;
    page?: number;
    limit?: number;
    search?: string;
    category?: 'packaging' | 'ingredients' | 'equipment' | 'other';
    status?: 'active' | 'inactive';
}

export class SupplierService {
    async findAll(filters: SupplierFilters) {
        const { storeId, page = 1, limit = 20, search, category, status } = filters;
        const offset = (page - 1) * limit;

        const conditions: ReturnType<typeof eq>[] = [eq(suppliers.storeId, storeId)];

        if (category) {
            conditions.push(eq(suppliers.category, category));
        }

        if (status) {
            conditions.push(eq(suppliers.status, status));
        }

        if (search) {
            conditions.push(like(suppliers.name, `%${search}%`));
        }

        const result = await db.select()
            .from(suppliers)
            .where(and(...conditions))
            .orderBy(desc(suppliers.createdAt))
            .limit(limit)
            .offset(offset);

        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(suppliers)
            .where(and(...conditions));

        const total = countResult[0]?.count ?? 0;

        return {
            data: result,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }

    async findById(id: string, storeId: string) {
        const result = await db
            .select()
            .from(suppliers)
            .where(and(eq(suppliers.id, id), eq(suppliers.storeId, storeId)))
            .limit(1);

        return result[0] ?? null;
    }

    async create(data: Omit<NewSupplier, 'id' | 'createdAt' | 'updatedAt'>) {
        const id = uuidv4();
        const result = await db.insert(suppliers).values({ ...data, id }).returning();
        return result[0];
    }

    async update(id: string, storeId: string, data: Partial<NewSupplier>) {
        const result = await db
            .update(suppliers)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(suppliers.id, id), eq(suppliers.storeId, storeId)))
            .returning();

        return result[0] ?? null;
    }

    async delete(id: string, storeId: string) {
        const result = await db
            .delete(suppliers)
            .where(and(eq(suppliers.id, id), eq(suppliers.storeId, storeId)))
            .returning();

        return result[0] ?? null;
    }
}

export const supplierService = new SupplierService();
