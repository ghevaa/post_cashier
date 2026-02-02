import { db } from '../config/db';
import { categories, type Category, type NewCategory } from '../db/schema';
import { eq, and, ilike } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const categoryService = {
    async findAll(storeId: string, search?: string): Promise<Category[]> {
        const conditions = [eq(categories.storeId, storeId)];

        if (search) {
            conditions.push(ilike(categories.name, `%${search}%`));
        }

        return db.select()
            .from(categories)
            .where(and(...conditions))
            .orderBy(categories.name);
    },

    async findById(id: string, storeId: string): Promise<Category | undefined> {
        const [category] = await db.select()
            .from(categories)
            .where(and(
                eq(categories.id, id),
                eq(categories.storeId, storeId)
            ))
            .limit(1);
        return category;
    },

    async create(data: Omit<NewCategory, 'id'>): Promise<Category> {
        const id = nanoid();
        const [category] = await db.insert(categories)
            .values({
                id,
                ...data,
            })
            .returning();
        return category;
    },

    async update(id: string, storeId: string, data: Partial<NewCategory>): Promise<Category | undefined> {
        const [category] = await db.update(categories)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(and(
                eq(categories.id, id),
                eq(categories.storeId, storeId)
            ))
            .returning();
        return category;
    },

    async delete(id: string, storeId: string): Promise<Category | undefined> {
        const [category] = await db.delete(categories)
            .where(and(
                eq(categories.id, id),
                eq(categories.storeId, storeId)
            ))
            .returning();
        return category;
    },
};
