import React from 'react';
import { useCurrency } from '../../contexts/StoreContext';

const ReportsChart = ({ salesData = [], loading = false }) => {
    const { formatCurrency } = useCurrency();
    const maxRevenue = Math.max(...salesData.map(item => parseFloat(item.revenue) || 0), 1);
    const total = salesData.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0);

    const getLabel = (item, index) => {
        if (!item.date) return `Day ${index + 1}`;
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-800 shadow-sm p-6 animate-pulse">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-800 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-text-main dark:text-white">Sales Trends</h3>
                    <p className="text-sm text-gray-500">{formatCurrency(total)} total</p>
                </div>
                <button className="text-primary text-sm font-medium hover:underline">View Full Report</button>
            </div>

            {/* Bar Chart */}
            <div className="w-full h-64 flex items-end gap-2 sm:gap-4 md:gap-6 justify-between px-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                {salesData.length > 0 ? (
                    salesData.map((item, index) => {
                        const revenue = parseFloat(item.revenue) || 0;
                        const heightPercent = Math.max((revenue / maxRevenue) * 100, 2);

                        return (
                            <div key={index} className="flex-1 flex flex-col justify-end gap-2 group cursor-pointer relative h-full">
                                <div
                                    className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-sm relative overflow-hidden mt-auto"
                                    style={{ height: `${heightPercent}%` }}
                                >
                                    <div className="absolute bottom-0 w-full bg-primary/80 h-full rounded-t-sm group-hover:bg-primary transition-colors"></div>
                                </div>
                                <span className="text-xs text-center text-gray-400 dark:text-gray-500 font-medium">
                                    {getLabel(item, index)}
                                </span>
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    Rev: {formatCurrency(revenue)}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex items-center justify-center h-full w-full text-text-muted">
                        <div className="text-center">
                            <span className="material-symbols-outlined text-4xl mb-2 block text-gray-300 dark:text-gray-600">show_chart</span>
                            <p className="text-sm">No sales data for this period</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsChart;
