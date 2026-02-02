import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

const SuppliersFilters = ({ filters = {}, onFilterChange }) => {
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
        onFilterChange?.({ category: e.target.value });
    };

    return (
        <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-color dark:border-gray-800 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 w-full md:w-auto gap-4 flex-col md:flex-row">
                {/* Search */}
                <div className="relative flex-1 max-w-md group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined">search</span>
                    </span>
                    <input
                        className="w-full pl-10 pr-4 py-2.5 bg-background-light dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-text-main dark:text-white placeholder-gray-400 transition-all outline-none"
                        placeholder="Search by name, contact, or ID..."
                        type="text"
                        value={searchInput}
                        onChange={handleSearchChange}
                    />
                </div>
                {/* Category Filter */}
                <div className="relative w-full md:w-64">
                    <select
                        className="w-full pl-4 pr-10 py-2.5 bg-background-light dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-text-main dark:text-white appearance-none cursor-pointer outline-none"
                        value={filters.category || ''}
                        onChange={handleCategoryChange}
                    >
                        <option value="">All Categories</option>
                        <option value="packaging">Packaging & Plastics</option>
                        <option value="ingredients">Baking Ingredients</option>
                        <option value="equipment">Equipment</option>
                        <option value="logistics">Logistics</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <span className="material-symbols-outlined">expand_more</span>
                    </span>
                </div>
            </div>
            {/* View Options */}
            <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-4">
                <button className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="List View">
                    <span className="material-symbols-outlined">list</span>
                </button>
                <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Export">
                    <span className="material-symbols-outlined">download</span>
                </button>
            </div>
        </div>
    );
};

export default SuppliersFilters;
