import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SuppliersFilters from '../components/suppliers/SuppliersFilters';
import SuppliersTable from '../components/suppliers/SuppliersTable';
import api from '../lib/api';
import { exportToExcel } from '../lib/exportUtils';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ search: '', category: '', status: '' });

    useEffect(() => {
        fetchSuppliers();
    }, [filters, pagination.page]);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const result = await api.suppliers.list({
                page: pagination.page,
                limit: pagination.limit,
                ...filters,
            });
            setSuppliers(result.data || []);
            setPagination(prev => ({ ...prev, ...result.pagination }));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, page }));
    };

    const handleDelete = async (supplierId) => {
        if (!window.confirm('Are you sure you want to delete this supplier?')) return;

        try {
            await api.suppliers.delete(supplierId);
            fetchSuppliers();
        } catch (err) {
            alert('Failed to delete supplier: ' + err.message);
        }
    };

    const handleExport = () => {
        const columns = [
            { key: 'name', label: 'Supplier Name' },
            { key: 'contactName', label: 'Contact Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'address', label: 'Address' },
            { key: 'category', label: 'Category' },
            { key: 'status', label: 'Status' },
        ];
        exportToExcel(suppliers, `suppliers_${new Date().toISOString().split('T')[0]}`, columns);
    };

    return (
        <Layout>
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between mb-8 mt-2">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold text-text-main dark:text-white tracking-tight">Manage Suppliers</h2>
                    <p className="text-text-muted dark:text-gray-400 max-w-2xl">View and manage your list of ingredient and packaging suppliers.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center justify-center gap-2 bg-surface-light dark:bg-white/10 border border-gray-200 dark:border-gray-700 text-text-main dark:text-white font-semibold px-5 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/20 transition-all"
                    >
                        <span className="material-symbols-outlined">file_download</span>
                        <span>Export</span>
                    </button>
                    <Link to="/suppliers/add" className="group flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-text-main font-bold px-6 py-3 rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <span className="material-symbols-outlined">add</span>
                        <span>Add New Supplier</span>
                    </Link>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-8">
                <SuppliersFilters filters={filters} onFilterChange={handleFilterChange} />
                <SuppliersTable
                    suppliers={suppliers}
                    loading={loading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onDelete={handleDelete}
                />
            </div>
        </Layout>
    );
};

export default Suppliers;
