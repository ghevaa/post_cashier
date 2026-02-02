import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import InventoryFilters from '../components/InventoryFilters';
import InventoryTable from '../components/InventoryTable';
import api from '../lib/api';
import { exportToExcel, formatCurrency } from '../lib/exportUtils';

const Inventory = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters from URL params
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        categoryId: searchParams.get('category') || '',
        status: searchParams.get('status') || '',
        sortBy: searchParams.get('sortBy') || 'createdAt',
        sortOrder: searchParams.get('sortOrder') || 'desc',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filters, pagination.page]);

    const fetchCategories = async () => {
        try {
            const result = await api.categories.list();
            setCategories(result || []);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const result = await api.products.list({
                page: pagination.page,
                limit: pagination.limit,
                ...filters,
            });
            setProducts(result.data || []);
            setPagination(prev => ({ ...prev, ...result.pagination }));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, page }));
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.products.delete(productId);
            fetchProducts(); // Refresh list
        } catch (err) {
            alert('Failed to delete product: ' + err.message);
        }
    };

    const handleExport = () => {
        const columns = [
            { key: 'name', label: 'Product Name' },
            { key: 'sku', label: 'SKU' },
            { key: 'category.name', label: 'Category' },
            { key: 'price', label: 'Price', format: (v) => formatCurrency(v, 'IDR') },
            { key: 'costPrice', label: 'Cost Price', format: (v) => formatCurrency(v, 'IDR') },
            { key: 'stock', label: 'Stock' },
            { key: 'minStock', label: 'Min Stock' },
            { key: 'status', label: 'Status' },
        ];
        exportToExcel(products, `inventory_${new Date().toISOString().split('T')[0]}`, columns);
    };

    return (
        <Layout>
            {/* Page Heading & Actions */}
            <div className="flex-shrink-0 px-6 py-6 md:px-8 border-b border-border-color dark:border-gray-800 bg-surface-light/50 dark:bg-surface-dark/50 backdrop-blur-sm z-10">
                <div className="max-w-[1400px] mx-auto flex flex-wrap justify-between items-end gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-text-main dark:text-white text-3xl font-black tracking-tight">Inventory Management</h1>
                        <p className="text-text-muted dark:text-gray-400 text-sm font-medium">Manage your product catalog, stock levels, and pricing.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExport}
                            className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-surface-light dark:bg-white/10 border border-gray-200 dark:border-gray-700 text-text-main dark:text-white text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/20 transition-all"
                        >
                            <span className="material-symbols-outlined text-lg">file_download</span>
                            <span>Export</span>
                        </button>
                        <Link to="/inventory/add" className="flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-primary hover:bg-green-400 text-[#052e16] text-sm font-bold shadow-sm shadow-green-500/20 transition-all transform active:scale-95">
                            <span className="material-symbols-outlined text-xl">add</span>
                            <span>Add Product</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:px-8">
                <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                    {error && (
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
                            {error}
                        </div>
                    )}
                    <InventoryFilters
                        filters={filters}
                        categories={categories}
                        onFilterChange={handleFilterChange}
                    />
                    <InventoryTable
                        products={products}
                        loading={loading}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Inventory;
