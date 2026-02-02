import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

const StoreInfo = () => {
    const [store, setStore] = useState({
        name: '',
        taxNumber: '',
        address: '',
        phone: '',
        email: '',
        inviteCode: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [originalStore, setOriginalStore] = useState(null);

    useEffect(() => {
        fetchStore();
    }, []);

    const fetchStore = async () => {
        try {
            setLoading(true);
            const data = await api.store.get();
            setStore({
                name: data.name || '',
                taxNumber: data.taxNumber || '',
                address: data.address || '',
                phone: data.phone || '',
                email: data.email || '',
                inviteCode: data.inviteCode || '',
            });
            setOriginalStore({
                name: data.name || '',
                taxNumber: data.taxNumber || '',
                address: data.address || '',
                phone: data.phone || '',
                email: data.email || '',
                inviteCode: data.inviteCode || '',
            });
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setStore(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await api.store.update(store);
            setOriginalStore({ ...store });
            setHasChanges(false);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (originalStore) {
            setStore({ ...originalStore });
            setHasChanges(false);
        }
    };

    if (loading) {
        return (
            <section className="bg-white dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border-color dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">store</span>
                        <h2 className="text-text-main dark:text-white text-lg font-bold">Store Information</h2>
                    </div>
                </div>
                <div className="p-6 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border-color dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">store</span>
                    <h2 className="text-text-main dark:text-white text-lg font-bold">Store Information</h2>
                </div>
                {hasChanges && (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>
            {error && (
                <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                    {error}
                </div>
            )}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Invite Code - Read Only */}
                {store.inviteCode && (
                    <div className="md:col-span-2 p-4 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-text-main dark:text-gray-200 text-sm font-medium flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">share</span>
                                    Store Invite Code
                                </span>
                                <p className="text-text-muted text-xs mt-1">Share this code with managers and cashiers to join your store</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <code className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg font-mono text-lg font-bold text-primary tracking-widest border border-primary/30">
                                    {store.inviteCode}
                                </code>
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(store.inviteCode);
                                    }}
                                    className="p-2 rounded-lg hover:bg-primary/20 text-primary transition-colors"
                                    title="Copy invite code"
                                >
                                    <span className="material-symbols-outlined">content_copy</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Store Name */}
                <label className="flex flex-col gap-2">
                    <span className="text-text-main dark:text-gray-200 text-sm font-medium">Store Name</span>
                    <input
                        className="w-full rounded-lg border-border-color dark:border-gray-700 bg-background-light dark:bg-gray-900 dark:text-white focus:border-primary focus:ring-0 placeholder:text-text-muted h-12 px-4 text-base transition-colors"
                        type="text"
                        value={store.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Enter store name"
                    />
                </label>
                {/* Tax ID */}
                <label className="flex flex-col gap-2">
                    <span className="text-text-main dark:text-gray-200 text-sm font-medium">Tax ID / VAT Number</span>
                    <input
                        className="w-full rounded-lg border-border-color dark:border-gray-700 bg-background-light dark:bg-gray-900 dark:text-white focus:border-primary focus:ring-0 placeholder:text-text-muted h-12 px-4 text-base transition-colors"
                        type="text"
                        value={store.taxNumber}
                        onChange={(e) => handleChange('taxNumber', e.target.value)}
                        placeholder="Enter tax ID"
                    />
                </label>
                {/* Address */}
                <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-text-main dark:text-gray-200 text-sm font-medium">Store Address</span>
                    <input
                        className="w-full rounded-lg border-border-color dark:border-gray-700 bg-background-light dark:bg-gray-900 dark:text-white focus:border-primary focus:ring-0 placeholder:text-text-muted h-12 px-4 text-base transition-colors"
                        type="text"
                        value={store.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="Enter store address"
                    />
                </label>
                {/* Phone */}
                <label className="flex flex-col gap-2">
                    <span className="text-text-main dark:text-gray-200 text-sm font-medium">Phone Number</span>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">phone</span>
                        <input
                            className="w-full rounded-lg border-border-color dark:border-gray-700 bg-background-light dark:bg-gray-900 dark:text-white focus:border-primary focus:ring-0 placeholder:text-text-muted h-12 pl-10 pr-4 text-base transition-colors"
                            type="tel"
                            value={store.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            placeholder="Enter phone number"
                        />
                    </div>
                </label>
                {/* Email */}
                <label className="flex flex-col gap-2">
                    <span className="text-text-main dark:text-gray-200 text-sm font-medium">Contact Email</span>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">mail</span>
                        <input
                            className="w-full rounded-lg border-border-color dark:border-gray-700 bg-background-light dark:bg-gray-900 dark:text-white focus:border-primary focus:ring-0 placeholder:text-text-muted h-12 pl-10 pr-4 text-base transition-colors"
                            type="email"
                            value={store.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder="Enter contact email"
                        />
                    </div>
                </label>
            </div>
        </section>
    );
};

export default StoreInfo;
