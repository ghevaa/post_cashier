import React from 'react';
import { useCurrency } from '../contexts/StoreContext';

const StatsCard = ({ title, value, change, changeLabel, icon, iconColorClass, changeColorClass, loading }) => {
    if (loading) {
        return (
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light dark:bg-surface-dark border border-border-color dark:border-gray-800 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mt-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mt-2"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light dark:bg-surface-dark border border-border-color dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-start">
                <p className="text-text-muted text-sm font-medium">{title}</p>
                <span className={`p-1.5 rounded-md ${iconColorClass}`}>
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
                <p className="text-text-main dark:text-white text-2xl font-bold">{value}</p>
                {change && (
                    <div className={`flex items-center text-sm font-medium px-1.5 rounded ${changeColorClass}`}>
                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                        <span>{change}</span>
                    </div>
                )}
                {!change && changeLabel && (
                    <span className={`${changeColorClass} text-xs font-medium`}>{changeLabel}</span>
                )}
            </div>
            <p className="text-text-muted text-xs mt-1">vs. yesterday</p>
        </div>
    );
};

export const RevenueCard = ({ revenue = 0, change = '+0%', loading }) => {
    const { formatCurrency } = useCurrency();
    const isPositive = change && change.startsWith('+');

    return (
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light dark:bg-surface-dark border border-border-color dark:border-gray-800 shadow-sm">
            {loading ? (
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mt-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mt-2"></div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-start">
                        <p className="text-text-muted text-sm font-medium">Today's Revenue</p>
                        <span className="p-1.5 rounded-md bg-[#e7f3eb] dark:bg-primary/20 text-text-main dark:text-primary">
                            <span className="material-symbols-outlined text-[20px]">payments</span>
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-text-main dark:text-white text-2xl font-bold">{formatCurrency(revenue)}</p>
                        <div className={`flex items-center text-sm font-medium px-1.5 rounded ${isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                            <span className="material-symbols-outlined text-[14px]">{isPositive ? 'trending_up' : 'trending_down'}</span>
                            <span>{change}</span>
                        </div>
                    </div>
                    <p className="text-text-muted text-xs mt-1">vs. yesterday</p>
                </>
            )}
        </div>
    );
};

export const ProductsCard = ({ count = 0, categories = 0, loading }) => (
    <div className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light dark:bg-surface-dark border border-border-color dark:border-gray-800 shadow-sm">
        {loading ? (
            <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mt-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28 mt-2"></div>
            </div>
        ) : (
            <>
                <div className="flex justify-between items-start">
                    <p className="text-text-muted text-sm font-medium">Total Products</p>
                    <span className="p-1.5 rounded-md bg-[#e7f3eb] dark:bg-primary/20 text-text-main dark:text-primary">
                        <span className="material-symbols-outlined text-[20px]">package_2</span>
                    </span>
                </div>
                <p className="text-text-main dark:text-white text-2xl font-bold mt-1">{count?.toLocaleString() || 0}</p>
                <p className="text-text-muted text-xs mt-1">across {categories || 0} categories</p>
            </>
        )}
    </div>
);

export const LowStockCard = ({ count = 0, loading }) => (
    <div className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light dark:bg-surface-dark border border-border-color dark:border-gray-800 shadow-sm">
        {loading ? (
            <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 mt-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mt-2"></div>
            </div>
        ) : (
            <>
                <div className="flex justify-between items-start">
                    <p className="text-text-muted text-sm font-medium">Low Stock Alerts</p>
                    <span className="p-1.5 rounded-md bg-orange-100 text-orange-700">
                        <span className="material-symbols-outlined text-[20px]">warning</span>
                    </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-text-main dark:text-white text-2xl font-bold">{count} Items</p>
                    {count > 0 && <span className="text-orange-600 text-xs font-medium">Needs Attention</span>}
                </div>
                <p className="text-text-muted text-xs mt-1">{count > 0 ? 'Reorder suggested' : 'All stocked up!'}</p>
            </>
        )}
    </div>
);

export default StatsCard;
