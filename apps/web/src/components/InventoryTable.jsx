import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../contexts/StoreContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002';

const InventoryTable = ({ products = [], loading = false, pagination = {}, onPageChange, onDelete }) => {
    const { formatCurrency } = useCurrency();

    const getStatusStyles = (status) => {
        switch (status) {
            case 'in_stock': return 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-green-600/20';
            case 'low_stock': return 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 ring-orange-600/20';
            case 'out_of_stock': return 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-red-600/20';
            default: return 'bg-gray-50 text-gray-700';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'in_stock': return 'In Stock';
            case 'low_stock': return 'Low Stock';
            case 'out_of_stock': return 'Out of Stock';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-8 space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex gap-4 animate-pulse">
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                            </div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-12 text-center text-text-muted">
                    <span className="material-symbols-outlined text-5xl mb-4 block">inventory_2</span>
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p className="mb-4">Start by adding your first product to the inventory.</p>
                    <Link to="/inventory/add" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-[#052e16] font-semibold">
                        <span className="material-symbols-outlined">add</span>
                        Add Product
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#e7f3eb] dark:divide-gray-800">
                    <thead className="bg-[#f8fcf9] dark:bg-white/5">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Product Name
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-surface-light dark:bg-surface-dark divide-y divide-[#e7f3eb] dark:divide-gray-800">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-[#f0f9f4] dark:hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div
                                            className={`h-10 w-10 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 overflow-hidden flex items-center justify-center ${product.stockStatus === 'out_of_stock' ? 'grayscale opacity-70' : ''}`}
                                        >
                                            {product.image ? (
                                                <img
                                                    src={`${API_BASE}${product.image}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="material-symbols-outlined text-gray-400">inventory_2</span>
                                            )}
                                        </div>
                                        <div className={`ml-4 ${product.stockStatus === 'out_of_stock' ? 'opacity-60' : ''}`}>
                                            <div className="text-sm font-semibold text-text-main dark:text-white">{product.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">SKU: {product.barcode || 'N/A'} • {product.unit || 'pcs'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {product.categoryName ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                            <span className="material-symbols-outlined text-xs">category</span>
                                            {product.categoryName}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-text-muted">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`text-sm font-mono ${product.stockStatus === 'out_of_stock' ? 'text-red-600 dark:text-red-400 font-bold' : (product.stockStatus === 'low_stock' ? 'font-bold text-orange-600 dark:text-orange-400' : 'text-text-main dark:text-white')}`}>
                                        {(product.stock || 0).toLocaleString()}
                                    </div>
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap ${product.stockStatus === 'out_of_stock' ? 'opacity-60' : ''}`}>
                                    <div className="text-sm font-medium text-text-main dark:text-white">{formatCurrency(product.sellingPrice)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusStyles(product.stockStatus)}`}>
                                        <span className={`size-1.5 rounded-full ${product.stockStatus === 'in_stock' ? 'bg-green-500' : (product.stockStatus === 'low_stock' ? 'bg-orange-500 animate-pulse' : 'bg-red-500')}`}></span>
                                        {getStatusLabel(product.stockStatus)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link to={`/inventory/edit/${product.id}`} className="p-1 rounded text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </Link>
                                        <button
                                            onClick={() => onDelete?.(product.id)}
                                            className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="bg-surface-light dark:bg-surface-dark px-4 py-3 flex items-center justify-between border-t border-border-color dark:border-gray-800">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                Showing <span className="font-medium text-text-main dark:text-white">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                                <span className="font-medium text-text-main dark:text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                                <span className="font-medium text-text-main dark:text-white">{pagination.total}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={() => onPageChange?.(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>
                                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => onPageChange?.(pageNum)}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${pageNum === pagination.page
                                                ? 'bg-primary text-[#052e16] z-10'
                                                : 'text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-white/5'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => onPageChange?.(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryTable;
