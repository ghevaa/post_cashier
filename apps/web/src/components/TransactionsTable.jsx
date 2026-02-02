import React, { useState } from 'react';
import { exportToExcel, formatCurrency, formatDateTime } from '../lib/exportUtils';
import { useCurrency } from '../contexts/StoreContext';

const TransactionsTable = ({ transactions = [], loading = false, onFilter }) => {
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({
        paymentMethod: '',
        status: '',
        dateFrom: '',
        dateTo: '',
    });
    const { formatCurrency: formatCurrencyDisplay } = useCurrency();

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const handleExport = () => {
        const columns = [
            { key: 'id', label: 'Order ID', format: (v) => `#${v?.slice(-6) || ''}` },
            { key: 'createdAt', label: 'Date/Time', format: (v) => formatDateTime(v) },
            { key: 'itemCount', label: 'Items', format: (v) => `${v || 0} items` },
            { key: 'total', label: 'Amount', format: (v) => formatCurrency(v, 'USD') },
            { key: 'paymentMethod', label: 'Payment Method' },
            { key: 'status', label: 'Status' },
        ];
        exportToExcel(transactions, `transactions_${new Date().toISOString().split('T')[0]}`, columns);
    };

    const handleApplyFilters = () => {
        if (onFilter) {
            onFilter(filters);
        }
        setShowFilterModal(false);
    };

    const handleClearFilters = () => {
        const cleared = { paymentMethod: '', status: '', dateFrom: '', dateTo: '' };
        setFilters(cleared);
        if (onFilter) {
            onFilter(cleared);
        }
    };

    if (loading) {
        return (
            <div className="rounded-xl bg-surface-light dark:bg-surface-dark border border-border-color dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border-color dark:border-gray-800">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
                </div>
                <div className="p-4 space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex gap-4 animate-pulse">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-xl bg-surface-light dark:bg-surface-dark border border-border-color dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border-color dark:border-gray-800 flex justify-between items-center">
                    <h3 className="text-text-main dark:text-white text-lg font-bold">Latest Transactions</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowFilterModal(true)}
                            className="px-3 py-1.5 rounded-lg border border-border-color text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700 dark:text-white flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-base">filter_list</span>
                            Filter
                        </button>
                        <button
                            onClick={handleExport}
                            className="px-3 py-1.5 rounded-lg border border-border-color text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700 dark:text-white flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-base">download</span>
                            Export
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {transactions.length === 0 ? (
                        <div className="p-12 text-center text-text-muted">
                            <span className="material-symbols-outlined text-4xl mb-2 block">receipt_long</span>
                            <p>No transactions yet</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-background-light dark:bg-gray-800 border-b border-border-color dark:border-gray-700">
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-text-muted">Order ID</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-text-muted">Time</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-text-muted">Items</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-text-muted">Amount</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-text-muted">Payment</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-text-muted">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color dark:divide-gray-800 text-sm">
                                {transactions.map((trx, index) => (
                                    <tr key={trx.id || index} className="group hover:bg-background-light dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-4 px-6 font-medium text-text-main dark:text-white">
                                            #{trx.id?.slice(-6) || `TRX-${index}`}
                                        </td>
                                        <td className="py-4 px-6 text-text-muted">{formatTime(trx.createdAt)}</td>
                                        <td className="py-4 px-6 text-text-muted truncate max-w-[200px]">
                                            {trx.itemCount || 0} items
                                        </td>
                                        <td className="py-4 px-6 font-bold text-text-main dark:text-white">
                                            {formatCurrencyDisplay(trx.total)}
                                        </td>
                                        <td className="py-4 px-6 text-text-muted capitalize">{trx.paymentMethod || 'cash'}</td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${trx.status === 'completed'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : trx.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                {trx.status?.charAt(0).toUpperCase() + trx.status?.slice(1) || 'Unknown'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Filter Modal */}
            {showFilterModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowFilterModal(false)}>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-text-main dark:text-white">Filter Transactions</h3>
                            <button onClick={() => setShowFilterModal(false)} className="text-text-muted hover:text-text-main dark:hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-white mb-1">Payment Method</label>
                                <select
                                    value={filters.paymentMethod}
                                    onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-lg border border-border-color dark:border-gray-700 bg-background-light dark:bg-background-dark text-text-main dark:text-white"
                                >
                                    <option value="">All Methods</option>
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="digital">Digital</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-white mb-1">Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-lg border border-border-color dark:border-gray-700 bg-background-light dark:bg-background-dark text-text-main dark:text-white"
                                >
                                    <option value="">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-white mb-1">From Date</label>
                                    <input
                                        type="date"
                                        value={filters.dateFrom}
                                        onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-lg border border-border-color dark:border-gray-700 bg-background-light dark:bg-background-dark text-text-main dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-white mb-1">To Date</label>
                                    <input
                                        type="date"
                                        value={filters.dateTo}
                                        onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-lg border border-border-color dark:border-gray-700 bg-background-light dark:bg-background-dark text-text-main dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleClearFilters}
                                className="flex-1 px-4 py-2 rounded-lg border border-border-color dark:border-gray-700 text-text-main dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleApplyFilters}
                                className="flex-1 px-4 py-2 rounded-lg bg-primary text-text-main font-bold hover:bg-primary/90"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TransactionsTable;
