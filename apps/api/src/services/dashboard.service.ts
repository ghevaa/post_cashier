import { db } from '../config/db';
import { transactions, products } from '../db/schema/index';
import { eq, and, sql, gte, lte } from 'drizzle-orm';

export class DashboardService {
    async getStats(storeId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Today's revenue
        const todayRevenue = await db
            .select({ total: sql<number>`COALESCE(SUM(CAST(total AS DECIMAL)), 0)` })
            .from(transactions)
            .where(and(
                eq(transactions.storeId, storeId),
                eq(transactions.status, 'completed'),
                gte(transactions.createdAt, today),
                lte(transactions.createdAt, tomorrow)
            ));

        // Yesterday's revenue for comparison
        const yesterdayRevenue = await db
            .select({ total: sql<number>`COALESCE(SUM(CAST(total AS DECIMAL)), 0)` })
            .from(transactions)
            .where(and(
                eq(transactions.storeId, storeId),
                eq(transactions.status, 'completed'),
                gte(transactions.createdAt, yesterday),
                lte(transactions.createdAt, today)
            ));

        // Total products count
        const productsCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(products)
            .where(and(eq(products.storeId, storeId), eq(products.isActive, true)));

        // Low stock count
        const lowStockCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(products)
            .where(and(
                eq(products.storeId, storeId),
                eq(products.isActive, true),
                eq(products.stockStatus, 'low_stock')
            ));

        // Categories count
        const categoriesCountResult = await db.execute(sql`
      SELECT COUNT(DISTINCT category_id) as count FROM products WHERE store_id = ${storeId} AND is_active = true
    `);

        const todayTotal = todayRevenue[0]?.total ?? 0;
        const yesterdayTotal = yesterdayRevenue[0]?.total ?? 0;
        const revenueChange = yesterdayTotal > 0
            ? ((todayTotal - yesterdayTotal) / yesterdayTotal * 100).toFixed(1)
            : '0';

        return {
            todayRevenue: todayTotal,
            revenueChange: `${parseFloat(revenueChange) >= 0 ? '+' : ''}${revenueChange}%`,
            totalProducts: productsCount[0]?.count ?? 0,
            lowStockItems: lowStockCount[0]?.count ?? 0,
            categoriesCount: (categoriesCountResult.rows[0] as { count: number })?.count ?? 0,
        };
    }

    async getSalesChart(storeId: string, days = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        const result = await db.execute(sql`
      SELECT 
        DATE(created_at) as date,
        COALESCE(SUM(CAST(total AS DECIMAL)), 0) as revenue,
        COUNT(*) as transactions
      FROM transactions
      WHERE store_id = ${storeId}
        AND status = 'completed'
        AND created_at >= ${startDate}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

        return result.rows;
    }

    async getReportsStats(storeId: string, startDate: Date, endDate: Date) {
        // Total revenue and transaction count for period
        const statsResult = await db
            .select({
                totalRevenue: sql<number>`COALESCE(SUM(CAST(total AS DECIMAL)), 0)`,
                transactionCount: sql<number>`COUNT(*)`,
                avgOrderValue: sql<number>`COALESCE(AVG(CAST(total AS DECIMAL)), 0)`,
            })
            .from(transactions)
            .where(and(
                eq(transactions.storeId, storeId),
                eq(transactions.status, 'completed'),
                gte(transactions.createdAt, startDate),
                lte(transactions.createdAt, endDate)
            ));

        // Calculate actual profit from transaction items with cost prices
        const profitResult = await db.execute(sql`
            SELECT 
                COALESCE(SUM(CAST(ti.subtotal AS DECIMAL)), 0) as total_revenue,
                COALESCE(SUM(CAST(p.cost_price AS DECIMAL) * ti.quantity), 0) as total_cost
            FROM transaction_items ti
            JOIN transactions t ON t.id = ti.transaction_id
            JOIN products p ON p.id = ti.product_id
            WHERE t.store_id = ${storeId}
                AND t.status = 'completed'
                AND t.created_at >= ${startDate}
                AND t.created_at <= ${endDate}
        `);

        const profitData = profitResult.rows[0] as { total_revenue: number; total_cost: number } | undefined;
        const totalRevenue = parseFloat(String(profitData?.total_revenue || 0));
        const totalCost = parseFloat(String(profitData?.total_cost || 0));
        const netProfit = totalRevenue - totalCost;
        const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue * 100) : 0;

        // Compare with previous period
        const periodDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const prevEndDate = new Date(startDate);
        prevEndDate.setDate(prevEndDate.getDate() - 1); // Previous period ends one day before current period starts
        const prevStartDate = new Date(prevEndDate);
        prevStartDate.setDate(prevStartDate.getDate() - periodDays + 1);

        const prevStatsResult = await db
            .select({
                totalRevenue: sql<number>`COALESCE(SUM(CAST(total AS DECIMAL)), 0)`,
                transactionCount: sql<number>`COUNT(*)`,
            })
            .from(transactions)
            .where(and(
                eq(transactions.storeId, storeId),
                eq(transactions.status, 'completed'),
                gte(transactions.createdAt, prevStartDate),
                lte(transactions.createdAt, prevEndDate)
            ));

        // Previous period profit calculation
        const prevProfitResult = await db.execute(sql`
            SELECT 
                COALESCE(SUM(CAST(ti.subtotal AS DECIMAL)), 0) as total_revenue,
                COALESCE(SUM(CAST(p.cost_price AS DECIMAL) * ti.quantity), 0) as total_cost
            FROM transaction_items ti
            JOIN transactions t ON t.id = ti.transaction_id
            JOIN products p ON p.id = ti.product_id
            WHERE t.store_id = ${storeId}
                AND t.status = 'completed'
                AND t.created_at >= ${prevStartDate}
                AND t.created_at <= ${prevEndDate}
        `);

        const prevProfitData = prevProfitResult.rows[0] as { total_revenue: number; total_cost: number } | undefined;
        const prevTotalRevenue = parseFloat(String(prevProfitData?.total_revenue || 0));
        const prevTotalCost = parseFloat(String(prevProfitData?.total_cost || 0));
        const prevNetProfit = prevTotalRevenue - prevTotalCost;

        const current = statsResult[0];
        const prev = prevStatsResult[0];

        // Calculate percentage changes
        // Return null if no previous data to compare against
        const revenueChange = prev?.totalRevenue > 0
            ? ((current.totalRevenue - prev.totalRevenue) / prev.totalRevenue * 100)
            : null;

        const transactionChange = prev?.transactionCount > 0
            ? ((current.transactionCount - prev.transactionCount) / prev.transactionCount * 100)
            : null;

        const profitChange = prevNetProfit > 0
            ? ((netProfit - prevNetProfit) / prevNetProfit * 100)
            : null;

        return {
            totalRevenue: current.totalRevenue,
            transactionCount: current.transactionCount,
            avgOrderValue: current.avgOrderValue,
            revenueChange: revenueChange !== null ? revenueChange.toFixed(1) : null,
            transactionChange: transactionChange !== null ? transactionChange.toFixed(1) : null,
            netProfit: netProfit,
            profitMargin: profitMargin.toFixed(1),
            profitChange: profitChange !== null ? profitChange.toFixed(1) : null,
            hasPreviousPeriodData: (prev?.totalRevenue ?? 0) > 0 || (prev?.transactionCount ?? 0) > 0,
        };
    }

    async getBestSellingProducts(storeId: string, startDate: Date, endDate: Date, limit = 10) {
        const result = await db.execute(sql`
            SELECT 
                ti.product_id as "productId",
                ti.product_name as "productName",
                p.category_id as "categoryId",
                c.name as "categoryName",
                SUM(ti.quantity) as "quantitySold",
                SUM(CAST(ti.subtotal AS DECIMAL)) as "revenue",
                CASE 
                    WHEN SUM(CAST(ti.subtotal AS DECIMAL)) > 0 
                    THEN ROUND((SUM(CAST(ti.subtotal AS DECIMAL)) - SUM(CAST(p.cost_price AS DECIMAL) * ti.quantity)) / SUM(CAST(ti.subtotal AS DECIMAL)) * 100, 1)
                    ELSE 0 
                END as "profitMargin"
            FROM transaction_items ti
            JOIN transactions t ON t.id = ti.transaction_id
            JOIN products p ON p.id = ti.product_id
            LEFT JOIN categories c ON c.id = p.category_id
            WHERE t.store_id = ${storeId}
                AND t.status = 'completed'
                AND t.created_at >= ${startDate}
                AND t.created_at <= ${endDate}
            GROUP BY ti.product_id, ti.product_name, p.category_id, c.name
            ORDER BY "quantitySold" DESC
            LIMIT ${limit}
        `);

        return result.rows;
    }
}

export const dashboardService = new DashboardService();
