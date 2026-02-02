import { db } from '../config/db';
import { stores, type NewStore } from '../db/schema/index';
import { eq } from 'drizzle-orm';

export class StoreService {
    async findById(id: string) {
        const result = await db
            .select()
            .from(stores)
            .where(eq(stores.id, id))
            .limit(1);

        return result[0] ?? null;
    }

    async update(id: string, data: Partial<Omit<NewStore, 'id' | 'createdAt'>>) {
        const result = await db
            .update(stores)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(stores.id, id))
            .returning();

        return result[0] ?? null;
    }
}

export const storeService = new StoreService();
