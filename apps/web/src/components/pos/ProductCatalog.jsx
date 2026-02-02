import React, { useState, useMemo } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useCurrency } from '../../contexts/StoreContext';

const API_BASE = 'http://localhost:3002';

const ProductCatalog = ({ products = [], loading = false, onAddToCart }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const { formatCurrency } = useCurrency();

    // Debounce search query for filtering
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const categories = [
        { id: 'all', name: 'All Items', active: true },
        { id: 'baking', name: 'Baking', icon: 'grain' },
        { id: 'packaging', name: 'Packaging', icon: 'inventory_2' },
        { id: 'flavoring', name: 'Flavorings', icon: 'science' },
        { id: 'tools', name: 'Tools', icon: 'construction' },
    ];

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = !debouncedSearchQuery ||
                product.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                product.barcode?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [products, debouncedSearchQuery]);

    if (loading) {
        return (
            <main className="flex-1 flex flex-col min-w-0 relative">
                <div className="p-4 space-y-3 bg-background-light/95 dark:bg-background-dark/95">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 p-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="bg-surface-light dark:bg-surface-dark rounded-lg p-3 animate-pulse">
                            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-3"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 flex flex-col min-w-0 relative">
            {/* Sticky Filter Header */}
            <div className="p-4 space-y-3 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur z-10">
                {/* Search */}
                <label className="flex flex-col w-full h-12">
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-full shadow-sm">
                        <div className="text-text-muted dark:text-text-muted flex border-none bg-secondary-green dark:bg-secondary-green-dark items-center justify-center pl-4 rounded-l-lg border-r-0">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-main dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-secondary-green dark:bg-secondary-green-dark h-full placeholder:text-text-muted px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal transition-all"
                            placeholder="Scan SKU or search product name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="bg-secondary-green dark:bg-secondary-green-dark rounded-r-lg px-4 border-l border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900 transition-colors">
                            <span className="material-symbols-outlined text-text-muted">qr_code_scanner</span>
                        </button>
                    </div>
                </label>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hidden">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 transition-colors ${activeCategory === cat.id
                                ? 'bg-primary text-text-main shadow-sm shadow-primary/30 active:scale-95'
                                : 'bg-secondary-green dark:bg-secondary-green-dark hover:bg-green-200 dark:hover:bg-green-900 text-text-main dark:text-white'
                                }`}
                        >
                            {cat.icon && <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>}
                            <span className={`text-sm ${activeCategory === cat.id ? 'font-bold' : 'font-medium'}`}>{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Scrollable Grid */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-text-muted">
                        <span className="material-symbols-outlined text-5xl mb-4">search_off</span>
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm">Try adjusting your search</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => product.stock > 0 && onAddToCart(product)}
                                className={`group flex flex-col rounded-lg bg-surface-light dark:bg-surface-dark p-3 shadow-sm hover:shadow-md border border-transparent hover:border-primary/50 transition-all ${product.stock > 0 ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                            >
                                <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 relative overflow-hidden flex items-center justify-center">
                                    {product.image ? (
                                        <img
                                            src={`${API_BASE}${product.image}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600">inventory_2</span>
                                    )}
                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">Out of Stock</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col flex-1 gap-1">
                                    <div className="flex justify-between items-start">
                                        <p className="text-text-main dark:text-white text-sm font-bold leading-tight line-clamp-2 h-10">{product.name}</p>
                                        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-[10px] px-1.5 py-0.5 rounded font-mono">{product.unit || 'pcs'}</span>
                                    </div>
                                    <div className="flex items-end justify-between mt-auto">
                                        <div>
                                            <p className="text-primary text-base font-bold leading-normal">{formatCurrency(product.sellingPrice)}</p>
                                            <p className="text-text-muted text-xs font-normal">{product.stock || 0} in stock</p>
                                        </div>
                                        <button
                                            disabled={product.stock <= 0}
                                            className="size-8 rounded-full bg-secondary-green dark:bg-secondary-green-dark group-hover:bg-primary group-hover:text-black flex items-center justify-center transition-colors disabled:opacity-50"
                                        >
                                            <span className="material-symbols-outlined text-lg">add</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default ProductCatalog;
