import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

const API_BASE_URL = 'http://localhost:3002';

const Profile = () => {
    const { user, checkSession } = useAuth();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [storeEditMode, setStoreEditMode] = useState(false);
    const [storeForm, setStoreForm] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        currency: 'USD',
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchStore();
    }, []);

    useEffect(() => {
        if (store) {
            setStoreForm({
                name: store.name || '',
                phone: store.phone || '',
                email: store.email || '',
                address: store.address || '',
                currency: store.currency || 'USD',
            });
        }
    }, [store]);

    const fetchStore = async () => {
        try {
            const storeData = await api.store.get();
            setStore(storeData);
        } catch (err) {
            console.error('Failed to fetch store:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Image size must be less than 2MB' });
            return;
        }

        try {
            setUploadingImage(true);
            setMessage(null);
            await api.upload.profileImage(file);
            await checkSession(); // Refresh user data to get new image
            setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to upload image' });
        } finally {
            setUploadingImage(false);
            // Clear the input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveImage = async () => {
        if (!confirm('Are you sure you want to remove your profile picture?')) return;

        try {
            setUploadingImage(true);
            setMessage(null);
            await api.upload.deleteProfileImage();
            await checkSession(); // Refresh user data
            setMessage({ type: 'success', text: 'Profile picture removed successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to remove image' });
        } finally {
            setUploadingImage(false);
        }
    };

    const handleStoreFormChange = (field, value) => {
        setStoreForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveStore = async () => {
        try {
            setSaving(true);
            setMessage(null);
            await api.store.update(storeForm);
            await fetchStore();
            setStoreEditMode(false);
            setMessage({ type: 'success', text: 'Store information updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to update store' });
        } finally {
            setSaving(false);
        }
    };

    const handleCancelStoreEdit = () => {
        if (store) {
            setStoreForm({
                name: store.name || '',
                phone: store.phone || '',
                email: store.email || '',
                address: store.address || '',
                currency: store.currency || 'USD',
            });
        }
        setStoreEditMode(false);
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            cashier: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            kitchen: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        };
        return colors[role] || colors.cashier;
    };

    const getAccessLevelLabel = (level) => {
        const labels = {
            admin: 'Full Access',
            pos_only: 'POS Only',
            kitchen_display: 'Kitchen Display',
            reports_only: 'Reports Only',
        };
        return labels[level] || level;
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_BASE_URL}${imagePath}`;
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-8">
                <div className="max-w-[800px] mx-auto w-full flex flex-col gap-6">
                    {/* Page Header */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-text-main dark:text-white">
                            My Profile
                        </h1>
                        <p className="text-text-muted dark:text-gray-400 text-base font-normal">
                            View and manage your account information
                        </p>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                            <span className="material-symbols-outlined text-sm">
                                {message.type === 'success' ? 'check_circle' : 'error'}
                            </span>
                            {message.text}
                        </div>
                    )}

                    {/* Profile Card */}
                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-border-color dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">person</span>
                                <h2 className="text-text-main dark:text-white text-lg font-bold">Account Details</h2>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Profile Header */}
                            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border-color dark:border-gray-800">
                                {/* Avatar with upload */}
                                <div className="relative group">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        className="hidden"
                                    />
                                    <div
                                        onClick={handleImageClick}
                                        className={`bg-center bg-no-repeat bg-cover rounded-full w-24 h-24 border-4 border-primary/20 shadow-lg cursor-pointer transition-all ${uploadingImage ? 'opacity-50' : 'group-hover:border-primary/40'}`}
                                        style={{
                                            backgroundImage: user?.image
                                                ? `url("${getImageUrl(user.image)}")`
                                                : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDSdr8lnzWQAHY-aW_9PHgJ2FV0GSIe9iQnBEeksER1bXEvdpXhPWF-iX4KEojUYGmam9txYR9v70ye7Dqbbuxqnbo-EpOj_rzXolQc2yt6mcE-EpMoZo3f3Erx8UQ2ABiQP03ujE1LCTvcX8opnTi7sT3p9FWrPfcZouhTwmk83W7aplx2ZJgBO5AWocsI26sE1C2h9aH3qS3JlrKdOAJXq6m4V3VXPtTwWl5DlXJ9gDfsJ7VV9DgKGAmqeRrql3FYXFvmlECXyNQ")'
                                        }}
                                    >
                                        {uploadingImage && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                            </div>
                                        )}
                                    </div>
                                    {/* Camera Icon Overlay */}
                                    <button
                                        onClick={handleImageClick}
                                        disabled={uploadingImage}
                                        className="absolute bottom-0 right-0 bg-primary hover:bg-primary-dark rounded-full p-2 shadow-md transition-colors disabled:opacity-50"
                                        title="Change profile picture"
                                    >
                                        <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
                                    </button>
                                </div>

                                {/* User Info */}
                                <div className="flex flex-col items-center sm:items-start gap-2">
                                    <h3 className="text-2xl font-bold text-text-main dark:text-white">{user?.name}</h3>
                                    <p className="text-text-muted dark:text-gray-400">{user?.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleBadgeColor(user?.role)}`}>
                                            {user?.role || 'cashier'}
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                            {getAccessLevelLabel(user?.accessLevel)}
                                        </span>
                                    </div>
                                    {/* Remove image button */}
                                    {user?.image && user.image.startsWith('/uploads') && (
                                        <button
                                            onClick={handleRemoveImage}
                                            disabled={uploadingImage}
                                            className="mt-2 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 disabled:opacity-50"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                            Remove picture
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                {/* Name */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-text-muted dark:text-gray-400">Full Name</label>
                                    <p className="text-text-main dark:text-white font-medium text-lg">{user?.name}</p>
                                </div>

                                {/* Email */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-text-muted dark:text-gray-400">Email Address</label>
                                    <p className="text-text-main dark:text-white font-medium text-lg">{user?.email}</p>
                                </div>

                                {/* Role */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-text-muted dark:text-gray-400">Role</label>
                                    <p className="text-text-main dark:text-white font-medium text-lg capitalize">{user?.role || 'Cashier'}</p>
                                </div>

                                {/* Access Level */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-text-muted dark:text-gray-400">Access Level</label>
                                    <p className="text-text-main dark:text-white font-medium text-lg">{getAccessLevelLabel(user?.accessLevel)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Store Information */}
                    {store && (
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-border-color dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">store</span>
                                    <h2 className="text-text-main dark:text-white text-lg font-bold">Store Information</h2>
                                </div>
                                {!storeEditMode ? (
                                    <button
                                        onClick={() => setStoreEditMode(true)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        Edit
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleCancelStoreEdit}
                                            className="px-3 py-1.5 text-sm font-medium text-text-muted hover:text-text-main dark:text-gray-400 dark:hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveStore}
                                            disabled={saving}
                                            className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                                        >
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                {!storeEditMode ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Store Name */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium text-text-muted dark:text-gray-400">Store Name</label>
                                            <p className="text-text-main dark:text-white font-medium text-lg">{store.name || '-'}</p>
                                        </div>

                                        {/* Store Phone */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium text-text-muted dark:text-gray-400">Phone</label>
                                            <p className="text-text-main dark:text-white font-medium text-lg">{store.phone || '-'}</p>
                                        </div>

                                        {/* Store Email */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium text-text-muted dark:text-gray-400">Store Email</label>
                                            <p className="text-text-main dark:text-white font-medium text-lg">{store.email || '-'}</p>
                                        </div>

                                        {/* Currency */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium text-text-muted dark:text-gray-400">Currency</label>
                                            <p className="text-text-main dark:text-white font-medium text-lg">{store.currency || 'USD'}</p>
                                        </div>

                                        {/* Address */}
                                        <div className="flex flex-col gap-1 md:col-span-2">
                                            <label className="text-sm font-medium text-text-muted dark:text-gray-400">Address</label>
                                            <p className="text-text-main dark:text-white font-medium text-lg">{store.address || '-'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Store Name */}
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-text-muted dark:text-gray-400">Store Name</span>
                                            <input
                                                type="text"
                                                value={storeForm.name}
                                                onChange={(e) => handleStoreFormChange('name', e.target.value)}
                                                className="w-full rounded-lg border-border-color dark:border-gray-700 bg-background-light dark:bg-gray-900 dark:text-white focus:border-primary focus:ring-0 h-11 px-4 text-base transition-colors"
                                                placeholder="Store name"
                                            />
                                        </label>

                                        {/* Store Phone */}
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-text-muted dark:text-gray-400">Phone</span>
                                            <input
                                                type="tel"
                                                value={storeForm.phone}
                                                onChange={(e) => handleStoreFormChange('phone', e.target.value)}
                                                className="w-full rounded-lg border-border-color dark:border-gray-700 bg-background-light dark:bg-gray-900 dark:text-white focus:border-primary focus:ring-0 h-11 px-4 text-base transition-colors"
                                                placeholder="Phone number"
                                            />
                                        </label>

                                        {/* Store Email */}
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-text-muted dark:text-gray-400">Store Email</span>
                                            <input
                                                type="email"
                                                value={storeForm.email}
                                                onChange={(e) => handleStoreFormChange('email', e.target.value)}
                                                className="w-full rounded-lg border-border-color dark:border-gray-700 bg-background-light dark:bg-gray-900 dark:text-white focus:border-primary focus:ring-0 h-11 px-4 text-base transition-colors"
                                                placeholder="Store email"
                                            />
                                        </label>

                                        {/* Currency */}
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-text-muted dark:text-gray-400">Currency</span>
                                            <select
                                                value={storeForm.currency}
                                                onChange={(e) => handleStoreFormChange('currency', e.target.value)}
                                                className="w-full rounded-lg border-border-color dark:border-gray-700 bg-background-light dark:bg-gray-900 dark:text-white focus:border-primary focus:ring-0 h-11 px-4 text-base transition-colors"
                                            >
                                                <option value="USD">USD - US Dollar</option>
                                                <option value="IDR">IDR - Indonesian Rupiah</option>
                                                <option value="EUR">EUR - Euro</option>
                                                <option value="GBP">GBP - British Pound</option>
                                                <option value="SGD">SGD - Singapore Dollar</option>
                                                <option value="MYR">MYR - Malaysian Ringgit</option>
                                            </select>
                                        </label>

                                        {/* Address */}
                                        <label className="flex flex-col gap-2 md:col-span-2">
                                            <span className="text-sm font-medium text-text-muted dark:text-gray-400">Address</span>
                                            <textarea
                                                value={storeForm.address}
                                                onChange={(e) => handleStoreFormChange('address', e.target.value)}
                                                rows={3}
                                                className="w-full rounded-lg border-border-color dark:border-gray-700 bg-background-light dark:bg-gray-900 dark:text-white focus:border-primary focus:ring-0 px-4 py-3 text-base transition-colors resize-none"
                                                placeholder="Store address"
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
