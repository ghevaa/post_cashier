import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { RevenueCard, ProductsCard, LowStockCard } from '../components/StatsCard';
import SalesChart from '../components/SalesChart';
import LowStockList from '../components/LowStockList';
import TransactionsTable from '../components/TransactionsTable';
import api from '../lib/api';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartDays, setChartDays] = useState(7);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async (days = chartDays) => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all dashboard data in parallel
            const [statsRes, salesRes, lowStockRes, transactionsRes] = await Promise.allSettled([
                api.dashboard.stats(),
                api.dashboard.salesChart(days),
                api.products.lowStock(),
                api.dashboard.recentTransactions(5),
            ]);

            if (statsRes.status === 'fulfilled') setStats(statsRes.value);
            if (salesRes.status === 'fulfilled') setSalesData(salesRes.value);
            if (lowStockRes.status === 'fulfilled') setLowStockItems(lowStockRes.value);
            if (transactionsRes.status === 'fulfilled') setTransactions(transactionsRes.value);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePeriodChange = async (days) => {
        setChartDays(days);
        try {
            const salesRes = await api.dashboard.salesChart(days);
            setSalesData(salesRes);
        } catch (err) {
            console.error('Failed to fetch sales data:', err);
        }
    };

    return (
        <Layout>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
                <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                    {error && (
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
                            Failed to load dashboard data: {error}
                        </div>
                    )}

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <RevenueCard
                            revenue={stats?.todayRevenue}
                            change={stats?.revenueChange}
                            loading={loading}
                        />
                        <ProductsCard
                            count={stats?.totalProducts}
                            categories={stats?.categoriesCount}
                            loading={loading}
                        />
                        <LowStockCard
                            count={stats?.lowStockItems}
                            loading={loading}
                        />
                    </div>

                    {/* Middle Section: Charts & Low Stock List */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <SalesChart data={salesData} loading={loading} onPeriodChange={handlePeriodChange} />
                        <LowStockList items={lowStockItems} loading={loading} />
                    </div>

                    {/* Latest Transactions Table */}
                    <TransactionsTable transactions={transactions} loading={loading} />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
