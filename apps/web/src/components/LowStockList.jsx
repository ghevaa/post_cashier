import React from 'react';
import { Link } from 'react-router-dom';

const LowStockList = ({ items = [], loading = false }) => {
    const getAlertLevel = (stock, minStock) => {
        if (stock <= 0) return 'red';
        if (stock <= (minStock || 10) / 2) return 'red';
        return 'orange';
    };

    if (loading) {
        return (
            <div className="rounded-xl bg-surface-light dark:bg-surface-dark border border-border-color dark:border-gray-800 shadow-sm flex flex-col">
                <div className="p-6 border-b border-border-color dark:border-gray-800">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                </div>
                <div className="p-4 space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4 p-2 animate-pulse">
                            <div className="size-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-surface-light dark:bg-surface-dark border border-border-color dark:border-gray-800 shadow-sm flex flex-col">
            <div className="p-6 border-b border-border-color dark:border-gray-800 flex justify-between items-center">
                <h3 className="text-text-main dark:text-white text-lg font-bold">Low Stock Items</h3>
                <Link to="/inventory?status=low_stock" className="text-primary text-sm font-semibold hover:underline">View All</Link>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[300px] p-2">
                {items.length === 0 ? (
                    <div className="p-6 text-center text-text-muted">
                        <span className="material-symbols-outlined text-4xl mb-2 block">inventory_2</span>
                        <p>All items are well stocked!</p>
                    </div>
                ) : (
                    items.map((item, index) => {
                        const alertLevel = getAlertLevel(item.stock, item.minStockAlert);
                        return (
                            <div key={item.id || index} className="flex items-center gap-4 p-3 hover:bg-background-light dark:hover:bg-primary/5 rounded-lg transition-colors">
                                <div className={`flex items-center justify-center rounded-lg ${alertLevel === 'red' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'} shrink-0 size-10`}>
                                    <span className="material-symbols-outlined">{alertLevel === 'red' ? 'warning' : 'production_quantity_limits'}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-text-main dark:text-white font-medium truncate">{item.name}</p>
                                    <p className="text-text-muted text-xs">{item.unit || 'pcs'}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`${alertLevel === 'red' ? 'text-red-600' : 'text-orange-600'} font-bold`}>Qty: {item.stock}</p>
                                    <p className="text-text-muted text-xs">{item.stock <= 0 ? 'Out of Stock' : 'Low'}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default LowStockList;
