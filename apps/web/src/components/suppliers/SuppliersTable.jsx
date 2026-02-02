import React from 'react';
import { Link } from 'react-router-dom';

const SuppliersTable = ({ suppliers = [], loading = false, pagination = {}, onPageChange, onDelete }) => {
    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NA';
    };

    const getCategoryColor = (category) => {
        switch (category?.toLowerCase()) {
            case 'packaging': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
            case 'ingredients': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
            case 'equipment': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    if (loading) {
        return (
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-gray-800 overflow-hidden p-8">
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex gap-4 animate-pulse">
                            <div className="size-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (suppliers.length === 0) {
        return (
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-gray-800 overflow-hidden p-12 text-center text-text-muted">
                <span className="material-symbols-outlined text-5xl mb-4 block">local_shipping</span>
                <h3 className="text-lg font-semibold mb-2">No suppliers found</h3>
                <p className="mb-4">Start by adding your first supplier.</p>
                <Link to="/suppliers/add" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-[#052e16] font-semibold">
                    <span className="material-symbols-outlined">add</span>
                    Add Supplier
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-gray-800 overflow-hidden flex flex-col flex-1">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                            <th className="px-6 py-4 min-w-[200px]">Supplier Name</th>
                            <th className="px-6 py-4 min-w-[180px]">Contact Person</th>
                            <th className="px-6 py-4 min-w-[160px]">Phone / Email</th>
                            <th className="px-6 py-4 min-w-[240px]">Address</th>
                            <th className="px-6 py-4 min-w-[140px]">Category</th>
                            <th className="px-6 py-4 min-w-[100px]">Status</th>
                            <th className="px-6 py-4 w-[100px] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                        {suppliers.map((supplier) => (
                            <tr key={supplier.id} className="group hover:bg-primary/5 dark:hover:bg-primary/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                                            {getInitials(supplier.name)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-text-main dark:text-white">{supplier.name}</p>
                                            <p className="text-xs text-text-muted">ID: {supplier.id?.slice(-8)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-text-main dark:text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px] text-gray-400">person</span>
                                        {supplier.contactPerson || '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        {supplier.phone && (
                                            <div className="flex items-center gap-2 text-text-main dark:text-gray-300">
                                                <span className="material-symbols-outlined text-[16px] text-gray-400">call</span>
                                                {supplier.phone}
                                            </div>
                                        )}
                                        {supplier.email && (
                                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                <span className="material-symbols-outlined text-[16px] text-gray-400">mail</span>
                                                {supplier.email}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-text-main dark:text-gray-300">
                                    {supplier.address || '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(supplier.category)}`}>
                                        {supplier.category || 'General'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${supplier.status === 'active'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-900'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                        <span className={`size-1.5 rounded-full ${supplier.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                        {supplier.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link to={`/suppliers/edit/${supplier.id}`} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Edit">
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </Link>
                                        <button
                                            onClick={() => onDelete?.(supplier.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                            title="Delete"
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
                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing <span className="font-medium text-text-main dark:text-white">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                        <span className="font-medium text-text-main dark:text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                        <span className="font-medium text-text-main dark:text-white">{pagination.total}</span> suppliers
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange?.(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => onPageChange?.(i + 1)}
                                className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-sm font-semibold ${i + 1 === pagination.page
                                        ? 'bg-primary text-text-main shadow-sm'
                                        : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => onPageChange?.(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuppliersTable;
