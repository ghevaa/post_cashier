import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002';

const AddProduct = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    // Categories
    const [categories, setCategories] = useState([]);
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [creatingCategory, setCreatingCategory] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        barcode: '',
        categoryId: '',
        brandId: '',
        costPrice: '',
        sellingPrice: '',
        unit: 'pcs',
        stock: '',
        minStockAlert: '',
        hasWholesale: false,
        wholesaleMinQty: '',
        wholesalePrice: '',
        expirationDate: '',
        batchNumber: '',
        notes: '',
        image: '',
    });

    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await api.categories.list();
            setCategories(data || []);
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;

        setCreatingCategory(true);
        try {
            const newCategory = await api.categories.create({ name: newCategoryName.trim() });
            setCategories(prev => [...prev, newCategory]);
            setFormData(prev => ({ ...prev, categoryId: newCategory.id }));
            setNewCategoryName('');
            setShowNewCategory(false);
        } catch (err) {
            setError('Failed to create category: ' + err.message);
        } finally {
            setCreatingCategory(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        setUploading(true);
        setError('');
        try {
            const result = await api.upload.productImage(file);
            setFormData(prev => ({ ...prev, image: result.url }));
        } catch (err) {
            setError('Failed to upload image: ' + err.message);
            setImagePreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, image: '' }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const productData = {
                name: formData.name,
                barcode: formData.barcode || undefined,
                categoryId: formData.categoryId || undefined,
                brandId: formData.brandId || undefined,
                costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
                sellingPrice: parseFloat(formData.sellingPrice),
                unit: formData.unit,
                stock: formData.stock ? parseInt(formData.stock) : 0,
                minStockAlert: formData.minStockAlert ? parseInt(formData.minStockAlert) : 10,
                hasWholesale: formData.hasWholesale,
                wholesaleMinQty: formData.wholesaleMinQty ? parseInt(formData.wholesaleMinQty) : undefined,
                wholesalePrice: formData.wholesalePrice ? parseFloat(formData.wholesalePrice) : undefined,
                expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : undefined,
                batchNumber: formData.batchNumber || undefined,
                notes: formData.notes || undefined,
                image: formData.image || undefined,
            };

            await api.products.create(productData);
            navigate('/inventory');
        } catch (err) {
            setError(err.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-color dark:border-surface-dark px-10 py-3 bg-surface-light dark:bg-surface-dark">
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                        <div className="size-8 flex items-center justify-center rounded-lg bg-primary/20 text-primary">
                            <span className="material-symbols-outlined">bakery_dining</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Bake & Pack POS</h2>
                    </Link>
                </div>
            </header>

            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1 pb-20">
                        {/* Breadcrumbs */}
                        <nav className="flex flex-wrap gap-2 p-4 text-sm">
                            <Link to="/" className="text-text-muted hover:text-primary font-medium transition-colors">Home</Link>
                            <span className="text-text-muted font-medium">/</span>
                            <Link to="/inventory" className="text-text-muted hover:text-primary font-medium transition-colors">Inventory</Link>
                            <span className="text-text-muted font-medium">/</span>
                            <span className="text-text-main dark:text-white font-medium">Add Product</span>
                        </nav>

                        {/* Page Heading */}
                        <div className="flex flex-wrap justify-between gap-3 p-4 mb-4">
                            <div className="flex min-w-72 flex-col gap-2">
                                <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-text-main dark:text-white">Add New Product</h1>
                                <p className="text-text-muted text-base font-normal">Fill in the details to add a new item to your inventory.</p>
                            </div>
                        </div>

                        {error && (
                            <div className="mx-4 mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
                                {error}
                            </div>
                        )}

                        {/* Main Form Area */}
                        <form className="flex flex-col gap-6" onSubmit={handleSave}>
                            {/* Section: Product Image */}
                            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-surface-dark overflow-hidden">
                                <div className="px-6 py-4 border-b border-border-color dark:border-surface-dark flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">image</span>
                                    <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-main dark:text-white">Product Image</h3>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-6">
                                        <div
                                            onClick={handleImageClick}
                                            className={`w-32 h-32 rounded-lg border-2 border-dashed border-border-color dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden ${uploading ? 'opacity-50' : ''}`}
                                        >
                                            {imagePreview || formData.image ? (
                                                <img
                                                    src={imagePreview || `${API_BASE}${formData.image}`}
                                                    alt="Product preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-center text-text-muted">
                                                    <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                                                    <p className="text-xs mt-1">Click to upload</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/gif,image/webp"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            <p className="text-sm text-text-muted mb-2">
                                                Upload a product image. Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB.
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handleImageClick}
                                                    disabled={uploading}
                                                    className="px-4 py-2 rounded-lg border border-border-color text-sm font-medium hover:bg-gray-50 dark:hover:bg-surface-dark disabled:opacity-50"
                                                >
                                                    {uploading ? 'Uploading...' : 'Choose File'}
                                                </button>
                                                {(imagePreview || formData.image) && (
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage}
                                                        className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 1: Basic Information */}
                            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-surface-dark overflow-hidden">
                                <div className="px-6 py-4 border-b border-border-color dark:border-surface-dark flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">inventory_2</span>
                                    <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-main dark:text-white">Basic Information</h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Product Name */}
                                    <label className="flex flex-col w-full">
                                        <span className="text-sm font-medium leading-normal pb-2 text-text-main dark:text-border-color">Product Name <span className="text-red-500">*</span></span>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="form-input w-full rounded-lg border border-border-color dark:border-text-muted bg-background-light dark:bg-background-dark h-12 px-4 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-text-muted/60 text-text-main dark:text-white"
                                            placeholder="e.g. Almond Flour 1kg"
                                            required
                                            type="text"
                                        />
                                    </label>
                                    {/* Barcode / SKU */}
                                    <label className="flex flex-col w-full">
                                        <span className="text-sm font-medium leading-normal pb-2 text-text-main dark:text-border-color">Barcode / SKU</span>
                                        <input
                                            name="barcode"
                                            value={formData.barcode}
                                            onChange={handleChange}
                                            className="form-input w-full rounded-lg border border-border-color dark:border-text-muted bg-background-light dark:bg-background-dark h-12 px-4 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-text-muted/60 text-text-main dark:text-white"
                                            placeholder="Scan or type barcode"
                                            type="text"
                                        />
                                    </label>
                                    {/* Category */}
                                    <div className="flex flex-col w-full">
                                        <span className="text-sm font-medium leading-normal pb-2 text-text-main dark:text-border-color">Category</span>
                                        {!showNewCategory ? (
                                            <div className="flex gap-2">
                                                <select
                                                    name="categoryId"
                                                    value={formData.categoryId}
                                                    onChange={handleChange}
                                                    className="form-select flex-1 rounded-lg border border-border-color dark:border-text-muted bg-background-light dark:bg-background-dark h-12 px-4 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-text-main dark:text-white"
                                                >
                                                    <option value="">Select category</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewCategory(true)}
                                                    className="px-3 h-12 rounded-lg border border-border-color hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
                                                    title="Add new category"
                                                >
                                                    <span className="material-symbols-outlined">add</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <input
                                                    value={newCategoryName}
                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                    placeholder="New category name"
                                                    className="form-input flex-1 rounded-lg border border-border-color dark:border-text-muted bg-background-light dark:bg-background-dark h-12 px-4 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-text-main dark:text-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleCreateCategory}
                                                    disabled={creatingCategory || !newCategoryName.trim()}
                                                    className="px-4 h-12 rounded-lg bg-primary text-background-dark font-medium disabled:opacity-50"
                                                >
                                                    {creatingCategory ? '...' : 'Add'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setShowNewCategory(false); setNewCategoryName(''); }}
                                                    className="px-3 h-12 rounded-lg border border-border-color hover:bg-gray-50 dark:hover:bg-gray-800"
                                                >
                                                    <span className="material-symbols-outlined">close</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Price & Stock */}
                            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-surface-dark overflow-hidden">
                                <div className="px-6 py-4 border-b border-border-color dark:border-surface-dark flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">payments</span>
                                    <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-main dark:text-white">Price & Stock</h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                        <label className="flex flex-col w-full">
                                            <span className="text-sm font-medium leading-normal pb-2 text-text-main dark:text-border-color">Cost Price ($)</span>
                                            <input
                                                name="costPrice"
                                                value={formData.costPrice}
                                                onChange={handleChange}
                                                className="form-input w-full rounded-lg border border-border-color dark:border-text-muted bg-background-light dark:bg-background-dark h-12 px-4 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-text-muted/60 text-text-main dark:text-white"
                                                placeholder="0.00"
                                                step="0.01"
                                                type="number"
                                            />
                                        </label>
                                        <label className="flex flex-col w-full">
                                            <span className="text-sm font-medium leading-normal pb-2 text-text-main dark:text-border-color">Selling Price ($) <span className="text-red-500">*</span></span>
                                            <input
                                                name="sellingPrice"
                                                value={formData.sellingPrice}
                                                onChange={handleChange}
                                                className="form-input w-full rounded-lg border border-border-color dark:border-text-muted bg-background-light dark:bg-background-dark h-12 px-4 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-text-muted/60 text-text-main dark:text-white font-medium"
                                                placeholder="0.00"
                                                required
                                                step="0.01"
                                                type="number"
                                            />
                                        </label>
                                        <label className="flex flex-col w-full">
                                            <span className="text-sm font-medium leading-normal pb-2 text-text-main dark:text-border-color">Unit</span>
                                            <select
                                                name="unit"
                                                value={formData.unit}
                                                onChange={handleChange}
                                                className="form-select w-full rounded-lg border border-border-color dark:border-text-muted bg-background-light dark:bg-background-dark h-12 px-4 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-text-main dark:text-white"
                                            >
                                                <option value="pcs">Pieces (pcs)</option>
                                                <option value="kg">Kilogram (kg)</option>
                                                <option value="g">Gram (g)</option>
                                                <option value="l">Liter (l)</option>
                                                <option value="pack">Pack</option>
                                            </select>
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <label className="flex flex-col w-full">
                                            <span className="text-sm font-medium leading-normal pb-2 text-text-main dark:text-border-color">Initial Stock</span>
                                            <input
                                                name="stock"
                                                value={formData.stock}
                                                onChange={handleChange}
                                                className="form-input w-full rounded-lg border border-border-color dark:border-text-muted bg-background-light dark:bg-background-dark h-12 px-4 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-text-muted/60 text-text-main dark:text-white"
                                                placeholder="0"
                                                type="number"
                                            />
                                        </label>
                                        <label className="flex flex-col w-full">
                                            <span className="text-sm font-medium leading-normal pb-2 text-text-main dark:text-border-color">Min Stock Alert</span>
                                            <input
                                                name="minStockAlert"
                                                value={formData.minStockAlert}
                                                onChange={handleChange}
                                                className="form-input w-full rounded-lg border border-border-color dark:border-text-muted bg-background-light dark:bg-background-dark h-12 px-4 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-text-muted/60 text-text-main dark:text-white"
                                                placeholder="e.g. 10"
                                                type="number"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Action Bar */}
                            <div className="flex items-center justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/inventory')}
                                    className="px-6 py-3 rounded-lg text-base font-bold text-text-muted hover:bg-secondary-green dark:hover:bg-surface-dark/80 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="px-8 py-3 rounded-lg bg-primary text-background-dark text-base font-bold shadow-md hover:bg-primary-dark hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
