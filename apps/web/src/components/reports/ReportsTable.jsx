import React from 'react';
import { useCurrency } from '../../contexts/StoreContext';

const ReportsTable = ({ products = [], loading = false }) => {
    const { formatCurrency } = useCurrency();

    const getCategoryColor = (category) => {
        const colors = {
            'Plastics': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'Baking': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
            'default': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        };
        return colors[category] || colors.default;
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-800 shadow-sm flex flex-col overflow-hidden animate-pulse">
                <div className="flex border-b border-gray-200 dark:border-gray-800 p-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                </div>
                <div className="p-4 space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-4">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-800 shadow-sm flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
                <button className="px-6 py-4 text-sm font-bold text-text-main dark:text-white border-b-2 border-primary bg-primary/5 whitespace-nowrap">
                    Best-Selling Products
                </button>
                <button className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap">
                    Sales Log
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-4">Product Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4 text-right">Quantity Sold</th>
                            <th className="px-6 py-4 text-right">Revenue</th>
                            <th className="px-6 py-4 text-right">Profit Margin</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-text-main dark:text-white flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                            <span className="material-symbols-outlined text-sm">inventory_2</span>
                                        </div>
                                        {product.productName}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.categoryName)}`}>
                                            {product.categoryName || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-700 dark:text-gray-300">
                                        {parseInt(product.quantitySold).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-text-main dark:text-white">
                                        {formatCurrency(product.revenue)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-green-600 dark:text-primary font-medium">
                                        {parseFloat(product.profitMargin || 0).toFixed(1)}%
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                    <span className="material-symbols-outlined text-4xl mb-2 block text-gray-300 dark:text-gray-600">inventory</span>
                                    <p className="text-sm">No sales data for this period</p>
                                    <p className="text-xs text-gray-400 mt-1">Complete some transactions to see your best-selling products</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {products.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/30">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Showing 1-{products.length} products
                    </span>
                    <div className="flex gap-2">
                        <button disabled className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50">
                            Previous
                        </button>
                        <button disabled className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50">
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsTable;
