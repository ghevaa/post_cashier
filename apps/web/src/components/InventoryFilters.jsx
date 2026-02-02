import React, { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';

const InventoryFilters = ({ filters = {}, categories = [], onFilterChange }) => {
    const [searchInput, setSearchInput] = useState(filters.search || '');
    const debouncedSearch = useDebounce(searchInput, 300);

    // Trigger filter change when debounced value changes
    useEffect(() => {
        if (debouncedSearch !== filters.search) {
            onFilterChange?.({ search: debouncedSearch });
        }
    }, [debouncedSearch]);

    // Sync with external filter changes
    useEffect(() => {
        setSearchInput(filters.search || '');
    }, [filters.search]);

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleCategoryChange = (e) => {
        onFilterChange?.({ categoryId: e.target.value });
    };

    const handleStatusChange = (e) => {
        onFilterChange?.({ status: e.target.value });
    };

    return (
        <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-color dark:border-gray-800 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full lg:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-text-muted">search</span>
                </div>
                <input
                    className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-[#e7f3eb] dark:bg-primary/5 text-text-main dark:text-white placeholder-text-muted focus:ring-2 focus:ring-primary sm:text-sm h-12"
                    placeholder="Search by name, SKU, or barcode..."
                    type="text"
                    value={searchInput}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Filters Wrapper */}
            <div className="flex flex-wrap w-full lg:w-auto gap-3">
                {/* Category Select */}
                <div className="relative min-w-[160px] flex-1 lg:flex-none">
                    <select
                        className="appearance-none w-full bg-[#f8fcf9] dark:bg-surface-dark border border-border-color dark:border-gray-700 text-text-main dark:text-gray-200 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-medium h-12 cursor-pointer"
                        value={filters.categoryId || ''}
                        onChange={handleCategoryChange}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted">
                        <span className="material-symbols-outlined">expand_more</span>
                    </div>
                </div>

                {/* Stock Status Select */}
                <div className="relative min-w-[160px] flex-1 lg:flex-none">
                    <select
                        className="appearance-none w-full bg-[#f8fcf9] dark:bg-surface-dark border border-border-color dark:border-gray-700 text-text-main dark:text-gray-200 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-medium h-12 cursor-pointer"
                        value={filters.status || ''}
                        onChange={handleStatusChange}
                    >
                        <option value="">All Statuses</option>
                        <option value="in_stock">In Stock</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted">
                        <span className="material-symbols-outlined">expand_more</span>
                    </div>
                </div>

                {/* Sort Filter */}
                <button className="h-12 w-12 flex items-center justify-center rounded-lg border border-border-color dark:border-gray-700 bg-[#f8fcf9] dark:bg-surface-dark text-text-muted hover:bg-primary/10 hover:border-primary transition-colors">
                    <span className="material-symbols-outlined">filter_list</span>
                </button>
            </div>
        </div>
    );
};

export default InventoryFilters;
