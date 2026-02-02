import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';

const EditSupplier = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        category: '',
        status: 'active',
        notes: '',
    });

    useEffect(() => {
        fetchSupplier();
    }, [id]);

    const fetchSupplier = async () => {
        try {
            setLoading(true);
            const supplier = await api.suppliers.get(id);
            setFormData({
                name: supplier.name || '',
                contactPerson: supplier.contactPerson || '',
                email: supplier.email || '',
                phone: supplier.phone || '',
                address: supplier.address || '',
                category: supplier.category || '',
                status: supplier.status || 'active',
                notes: supplier.notes || '',
            });
        } catch (err) {
            setError('Failed to load supplier: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            await api.suppliers.update(id, formData);
            navigate('/suppliers');
        } catch (err) {
            setError(err.message || 'Failed to update supplier');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white min-h-screen flex flex-col">
            <header className="flex items-center justify-between border-b border-border-color dark:border-surface-dark px-10 py-3 bg-surface-light dark:bg-surface-dark">
                <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                    <div className="size-8 flex items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <span className="material-symbols-outlined">bakery_dining</span>
                    </div>
                    <h2 className="text-lg font-bold">Bake & Pack POS</h2>
                </Link>
            </header>

            <div className="flex-1 px-4 md:px-10 lg:px-40 py-5">
                <div className="max-w-[960px] mx-auto">
                    <nav className="flex gap-2 p-4 text-sm">
                        <Link to="/" className="text-text-muted hover:text-primary">Home</Link>
                        <span className="text-text-muted">/</span>
                        <Link to="/suppliers" className="text-text-muted hover:text-primary">Suppliers</Link>
                        <span className="text-text-muted">/</span>
                        <span className="text-text-main dark:text-white">Edit Supplier</span>
                    </nav>

                    <div className="p-4 mb-4">
                        <h1 className="text-4xl font-black text-text-main dark:text-white">Edit Supplier</h1>
                        <p className="text-text-muted mt-2">Update supplier information below.</p>
                    </div>

                    {error && (
                        <div className="mx-4 mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 rounded-lg text-red-700 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    <form className="flex flex-col gap-6 p-4" onSubmit={handleSave}>
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-surface-dark overflow-hidden">
                            <div className="px-6 py-4 border-b border-border-color dark:border-surface-dark flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">local_shipping</span>
                                <h3 className="text-lg font-bold">Supplier Information</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label className="flex flex-col">
                                    <span className="text-sm font-medium pb-2">Supplier Name <span className="text-red-500">*</span></span>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-input rounded-lg border border-border-color dark:border-text-muted bg-background-light dark:bg-background-dark h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary"
                                        required
                                    />
                                </label>
                                <label className="flex flex-col">
                                    <span className="text-sm font-medium pb-2">Contact Person</span>
                                    <input
                                        name="contactPerson"
                                        value={formData.contactPerson}
                                        onChange={handleChange}
                                        className="form-input rounded-lg border border-border-color dark:border-text-muted bg-background-light dark:bg-background-dark h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary"
                                    />
                                </label>
                                <label className="flex flex-col">
                                    <span className="text-sm font-medium pb-2">Email</span>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-input rounded-lg border border-border-color dark:border-text-muted bg-background-light dark:bg-background-dark h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary"
                                    />
                                </label>
                                <label className="flex flex-col">
                                    <span className="text-sm font-medium pb-2">Phone</span>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="form-input rounded-lg border border-border-color dark:border-text-muted bg-background-light dark:bg-background-dark h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary"
                                    />
                                </label>
                                <label className="flex flex-col md:col-span-2">
                                    <span className="text-sm font-medium pb-2">Address</span>
                                    <input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="form-input rounded-lg border border-border-color dark:border-text-muted bg-background-light dark:bg-background-dark h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary"
                                    />
                                </label>
                                <label className="flex flex-col">
                                    <span className="text-sm font-medium pb-2">Category</span>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="form-select rounded-lg border border-border-color dark:border-text-muted bg-background-light dark:bg-background-dark h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="">Select category</option>
                                        <option value="packaging">Packaging</option>
                                        <option value="ingredients">Ingredients</option>
                                        <option value="equipment">Equipment</option>
                                        <option value="logistics">Logistics</option>
                                    </select>
                                </label>
                                <label className="flex flex-col">
                                    <span className="text-sm font-medium pb-2">Status</span>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="form-select rounded-lg border border-border-color dark:border-text-muted bg-background-light dark:bg-background-dark h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/suppliers')}
                                className="px-6 py-3 rounded-lg font-bold text-text-muted hover:bg-gray-100 dark:hover:bg-surface-dark"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3 rounded-lg bg-primary text-background-dark font-bold shadow-md hover:bg-primary-dark disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Update Supplier'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditSupplier;
