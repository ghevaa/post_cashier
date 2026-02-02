import React from 'react';
import { useCurrency } from '../../contexts/StoreContext';

const KPIGrid = ({ stats, loading = false }) => {
    const { formatCurrency } = useCurrency();

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-border-color dark:border-gray-800 shadow-sm animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Revenue */}
            <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-border-color dark:border-gray-800 shadow-sm flex flex-col gap-1 relative overflow-hidden">
                <div className="flex justify-between items-start z-10">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Revenue</p>
                        <h3 className="text-text-main dark:text-white text-2xl lg:text-3xl font-bold mt-1 tracking-tight">
                            {formatCurrency(stats?.totalRevenue)}
                        </h3>
                    </div>
                    {stats?.revenueChange !== null ? (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${parseFloat(stats?.revenueChange) >= 0
                            ? 'bg-primary/10'
                            : 'bg-red-50 dark:bg-red-900/20'
                            }`}>
                            <span className={`material-symbols-outlined text-sm font-bold ${parseFloat(stats?.revenueChange) >= 0
                                ? 'text-green-600'
                                : 'text-red-600 dark:text-red-400'
                                }`}>
                                {parseFloat(stats?.revenueChange) >= 0 ? 'trending_up' : 'trending_down'}
                            </span>
                            <span className={`font-bold text-xs ${parseFloat(stats?.revenueChange) >= 0
                                ? 'text-green-700'
                                : 'text-red-600 dark:text-red-400'
                                }`}>
                                {parseFloat(stats?.revenueChange) >= 0 ? '+' : ''}{stats?.revenueChange}%
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20">
                            <span className="material-symbols-outlined text-sm font-bold text-blue-600">new_releases</span>
                            <span className="font-bold text-xs text-blue-700 dark:text-blue-400">New</span>
                        </div>
                    )}
                </div>
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
            </div>

            {/* Net Profit */}
            <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-border-color dark:border-gray-800 shadow-sm flex flex-col gap-1 relative overflow-hidden">
                <div className="flex justify-between items-start z-10">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Net Profit</p>
                        <h3 className="text-text-main dark:text-white text-2xl lg:text-3xl font-bold mt-1 tracking-tight">
                            {formatCurrency(stats?.netProfit)}
                        </h3>
                    </div>
                    {stats?.profitChange !== null ? (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${parseFloat(stats?.profitChange) >= 0
                            ? 'bg-primary/10'
                            : 'bg-red-50 dark:bg-red-900/20'
                            }`}>
                            <span className={`material-symbols-outlined text-sm font-bold ${parseFloat(stats?.profitChange) >= 0
                                ? 'text-green-600'
                                : 'text-red-600 dark:text-red-400'
                                }`}>
                                {parseFloat(stats?.profitChange) >= 0 ? 'trending_up' : 'trending_down'}
                            </span>
                            <span className={`font-bold text-xs ${parseFloat(stats?.profitChange) >= 0
                                ? 'text-green-700'
                                : 'text-red-600 dark:text-red-400'
                                }`}>
                                {parseFloat(stats?.profitChange) >= 0 ? '+' : ''}{stats?.profitChange}%
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20">
                            <span className="material-symbols-outlined text-sm font-bold text-blue-600">new_releases</span>
                            <span className="font-bold text-xs text-blue-700 dark:text-blue-400">New</span>
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{stats?.profitMargin || '0'}% margin</p>
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
            </div>

            {/* Transactions */}
            <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-border-color dark:border-gray-800 shadow-sm flex flex-col gap-1 relative overflow-hidden">
                <div className="flex justify-between items-start z-10">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Transactions</p>
                        <h3 className="text-text-main dark:text-white text-2xl lg:text-3xl font-bold mt-1 tracking-tight">
                            {stats?.transactionCount || 0}
                        </h3>
                    </div>
                    {stats?.transactionChange !== null ? (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${parseFloat(stats?.transactionChange) >= 0
                            ? 'bg-primary/10'
                            : 'bg-red-50 dark:bg-red-900/20'
                            }`}>
                            <span className={`material-symbols-outlined text-sm font-bold ${parseFloat(stats?.transactionChange) >= 0
                                ? 'text-green-600'
                                : 'text-red-600 dark:text-red-400'
                                }`}>
                                {parseFloat(stats?.transactionChange) >= 0 ? 'trending_up' : 'trending_down'}
                            </span>
                            <span className={`font-bold text-xs ${parseFloat(stats?.transactionChange) >= 0
                                ? 'text-green-700'
                                : 'text-red-600 dark:text-red-400'
                                }`}>
                                {parseFloat(stats?.transactionChange) >= 0 ? '+' : ''}{stats?.transactionChange}%
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20">
                            <span className="material-symbols-outlined text-sm font-bold text-blue-600">new_releases</span>
                            <span className="font-bold text-xs text-blue-700 dark:text-blue-400">New</span>
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                    Avg: {formatCurrency(stats?.avgOrderValue)} per order
                </p>
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
            </div>
        </div>
    );
};

export default KPIGrid;
