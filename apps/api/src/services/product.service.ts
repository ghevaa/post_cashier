import { db } from '../config/db';
import { products, type NewProduct } from '../db/schema/index';
import { eq, and, like, desc, asc, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export interface ProductFilters {
    storeId: string;
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    status?: 'in_stock' | 'low_stock' | 'out_of_stock';
    sortBy?: 'name' | 'stock' | 'price' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export class ProductService {
    async findAll(filters: ProductFilters) {
        const { storeId, page = 1, limit = 20, search, categoryId, status, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
        const offset = (page - 1) * limit;

        // Build where conditions
        const conditions: ReturnType<typeof eq>[] = [eq(products.storeId, storeId), eq(products.isActive, true)];

        if (categoryId) {
            conditions.push(eq(products.categoryId, categoryId));
        }

        if (status) {
            conditions.push(eq(products.stockStatus, status));
        }

        if (search) {
            conditions.push(like(products.name, `%${search}%`));
        }

        // Apply sorting
        const orderColumn = sortBy === 'name' ? products.name :
            sortBy === 'stock' ? products.stock :
                sortBy === 'price' ? products.sellingPrice :
                    products.createdAt;

        // Use raw SQL to join with categories for getting category name
        const result = await db.execute(sql`
            SELECT 
                p.id,
                p.store_id as "storeId",
                p.name,
                p.sku,
                p.barcode,
                p.description,
                p.image,
                p.category_id as "categoryId",
                p.brand_id as "brandId",
                p.supplier_id as "supplierId",
                p.cost_price as "costPrice",
                p.selling_price as "sellingPrice",
                p.unit,
                p.stock,
                p.min_stock_alert as "minStockAlert",
                p.stock_status as "stockStatus",
                p.wholesale_enabled as "wholesaleEnabled",
                p.wholesale_min_qty as "wholesaleMinQty",
                p.wholesale_price as "wholesalePrice",
                p.expiration_date as "expirationDate",
                p.batch_number as "batchNumber",
                p.allergens,
                p.is_active as "isActive",
                p.created_at as "createdAt",
                p.updated_at as "updatedAt",
                c.name as "categoryName"
            FROM products p
            LEFT JOIN categories c ON c.id = p.category_id
            WHERE p.store_id = ${storeId}
                AND p.is_active = true
                ${categoryId ? sql`AND p.category_id = ${categoryId}` : sql``}
                ${status ? sql`AND p.stock_status = ${status}` : sql``}
                ${search ? sql`AND p.name ILIKE ${`%${search}%`}` : sql``}
            ORDER BY ${sortBy === 'name' ? sql`p.name` : sortBy === 'stock' ? sql`p.stock` : sortBy === 'price' ? sql`p.selling_price` : sql`p.created_at`} ${sortOrder === 'asc' ? sql`ASC` : sql`DESC`}
            LIMIT ${limit}
            OFFSET ${offset}
        `);

        // Get total count
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(products)
            .where(and(...conditions));

        const total = countResult[0]?.count ?? 0;

        return {
            data: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findById(id: string, storeId: string) {
        const result = await db
            .select()
            .from(products)
            .where(and(eq(products.id, id), eq(products.storeId, storeId)))
            .limit(1);

        return result[0] ?? null;
    }

    async create(data: Omit<NewProduct, 'id' | 'createdAt' | 'updatedAt'>) {
        const id = uuidv4();
        const stockStatus = this.calculateStockStatus(data.stock ?? 0, data.minStockAlert ?? 10);

        const result = await db.insert(products).values({
            ...data,
            id,
            stockStatus,
        }).returning();

        return result[0];
    }

    async update(id: string, storeId: string, data: Partial<NewProduct>) {
        // Recalculate stock status if stock changed
        if (data.stock !== undefined && data.stock !== null) {
            const existing = await this.findById(id, storeId);
            if (existing) {
                let minAlert: number = 10;
                if (data.minStockAlert !== undefined && data.minStockAlert !== null) {
                    minAlert = data.minStockAlert;
                } else if (existing.minStockAlert !== null) {
                    minAlert = existing.minStockAlert;
                }
                data.stockStatus = this.calculateStockStatus(data.stock, minAlert);
            }
        }

        const result = await db
            .update(products)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(products.id, id), eq(products.storeId, storeId)))
            .returning();

        return result[0] ?? null;
    }

    async delete(id: string, storeId: string) {
        // Soft delete
        const result = await db
            .update(products)
            .set({ isActive: false, updatedAt: new Date() })
            .where(and(eq(products.id, id), eq(products.storeId, storeId)))
            .returning();

        return result[0] ?? null;
    }

    async getLowStock(storeId: string) {
        return db
            .select()
            .from(products)
            .where(and(
                eq(products.storeId, storeId),
                eq(products.isActive, true),
                eq(products.stockStatus, 'low_stock')
            ))
            .orderBy(asc(products.stock));
    }

    async updateStock(id: string, storeId: string, quantityChange: number) {
        const existing = await this.findById(id, storeId);
        if (!existing) return null;

        const newStock = (existing.stock ?? 0) + quantityChange;
        const stockStatus = this.calculateStockStatus(newStock, existing.minStockAlert ?? 10);

        return this.update(id, storeId, { stock: newStock, stockStatus });
    }

    private calculateStockStatus(stock: number, minAlert: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
        if (stock <= 0) return 'out_of_stock';
        if (stock <= minAlert) return 'low_stock';
        return 'in_stock';
    }
}

export const productService = new ProductService();
