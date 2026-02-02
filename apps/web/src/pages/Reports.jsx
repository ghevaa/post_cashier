import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import ReportsHeader from '../components/reports/ReportsHeader';
import KPIGrid from '../components/reports/KPIGrid';
import ReportsChart from '../components/reports/ReportsChart';
import ReportsTable from '../components/reports/ReportsTable';
import api from '../lib/api';
import { exportToExcel, printTable, formatCurrency, formatDate } from '../lib/exportUtils';

const Reports = () => {
    const [dateRange, setDateRange] = useState('30days');
    const [stats, setStats] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [bestSelling, setBestSelling] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getDateRange = useCallback(() => {
        const end = new Date();
        const start = new Date();

        switch (dateRange) {
            case '7days':
                start.setDate(start.getDate() - 7);
                break;
            case '30days':
                start.setDate(start.getDate() - 30);
                break;
            case 'this_month':
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                break;
            case 'last_month':
                start.setMonth(start.getMonth() - 1);
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                end.setDate(0); // Last day of previous month
                break;
            default:
                start.setDate(start.getDate() - 30);
        }

        return { start: start.toISOString(), end: end.toISOString() };
    }, [dateRange]);

    const fetchReportsData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { start, end } = getDateRange();
            const days = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 30;

            const [statsRes, salesRes, bestSellingRes] = await Promise.allSettled([
                api.dashboard.reportsStats(start, end),
                api.dashboard.salesChart(days),
                api.dashboard.bestSelling(start, end, 10),
            ]);

            if (statsRes.status === 'fulfilled') setStats(statsRes.value);
            if (salesRes.status === 'fulfilled') setSalesData(salesRes.value);
            if (bestSellingRes.status === 'fulfilled') setBestSelling(bestSellingRes.value);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [dateRange, getDateRange]);

    useEffect(() => {
        fetchReportsData();
    }, [fetchReportsData]);

    const handleDateRangeChange = (range) => {
        setDateRange(range);
    };

    const handlePrint = () => {
        const reportContent = `
            <h2 style="margin-bottom: 20px;">Sales Summary</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
                <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                    <p style="color: #666; margin-bottom: 5px;">Total Revenue</p>
                    <p style="font-size: 24px; font-weight: bold;">${formatCurrency(stats?.totalRevenue || 0, 'IDR')}</p>
                </div>
                <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                    <p style="color: #666; margin-bottom: 5px;">Net Profit</p>
                    <p style="font-size: 24px; font-weight: bold;">${formatCurrency(stats?.netProfit || 0, 'IDR')}</p>
                </div>
                <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                    <p style="color: #666; margin-bottom: 5px;">Total Transactions</p>
                    <p style="font-size: 24px; font-weight: bold;">${stats?.totalTransactions || 0}</p>
                </div>
            </div>
            <h3 style="margin-bottom: 15px;">Best Selling Products</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: left;">Product</th>
                        <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">Qty Sold</th>
                        <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    ${bestSelling.map(p => `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${p.name}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${p.quantitySold}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(p.revenue, 'IDR')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow popups to print');
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Sales Report</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #333; }
                    h1 { text-align: center; margin-bottom: 30px; }
                </style>
            </head>
            <body>
                <h1>Sales and Profit Report</h1>
                <p style="text-align: center; color: #666;">Period: ${dateRange === '7days' ? 'Last 7 Days' : dateRange === '30days' ? 'Last 30 Days' : dateRange === 'this_month' ? 'This Month' : 'Last Month'}</p>
                ${reportContent}
                <script>window.onload = function() { window.print(); window.onafterprint = function() { window.close(); } }</script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleExport = () => {
        // Export best selling products
        const columns = [
            { key: 'name', label: 'Product Name' },
            { key: 'quantitySold', label: 'Quantity Sold' },
            { key: 'revenue', label: 'Revenue', format: (v) => formatCurrency(v, 'IDR') },
        ];

        // Add summary row
        const dataWithSummary = [
            ...bestSelling,
            { name: '--- SUMMARY ---', quantitySold: '', revenue: '' },
            { name: 'Total Revenue', quantitySold: '', revenue: stats?.totalRevenue || 0 },
            { name: 'Net Profit', quantitySold: '', revenue: stats?.netProfit || 0 },
            { name: 'Total Transactions', quantitySold: stats?.totalTransactions || 0, revenue: '' },
        ];

        exportToExcel(dataWithSummary, `sales_report_${dateRange}_${new Date().toISOString().split('T')[0]}`, columns);
    };

    return (
        <Layout>
            <div className="flex flex-col h-full">
                <ReportsHeader
                    dateRange={dateRange}
                    onDateRangeChange={handleDateRangeChange}
                    onPrint={handlePrint}
                    onExport={handleExport}
                />
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
                    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                        {error && (
                            <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
                                Failed to load reports data: {error}
                            </div>
                        )}
                        <KPIGrid stats={stats} loading={loading} />
                        <div className="flex flex-col gap-6">
                            <ReportsChart salesData={salesData} loading={loading} />
                            <ReportsTable products={bestSelling} loading={loading} />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Reports;
