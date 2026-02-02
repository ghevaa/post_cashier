import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';

const CompleteProfile = () => {
    const navigate = useNavigate();
    const { user, checkSession } = useAuth();
    const [role, setRole] = useState('cashier');
    const [storeName, setStoreName] = useState('');
    const [storeAddress, setStoreAddress] = useState('');
    const [storePhone, setStorePhone] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isAdmin = role === 'admin';

    const handleComplete = async (e) => {
        e.preventDefault();
        setError('');

        // Validation based on role
        if (isAdmin && !storeName.trim()) {
            setError('Please enter your store name');
            return;
        }

        if (!isAdmin && !inviteCode.trim()) {
            setError('Please enter the store invite code from your admin');
            return;
        }

        setLoading(true);

        try {
            const profileData = isAdmin
                ? { role, storeName, storeAddress, storePhone }
                : { role, inviteCode: inviteCode.toUpperCase().trim() };

            await api.users.completeProfile(profileData);

            // Refresh session to get updated user data
            await checkSession();
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to complete profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display transition-colors duration-200">
            {/* Navbar */}
            <header className="w-full border-b border-border-color dark:border-surface-dark bg-surface-light dark:bg-surface-dark px-4 py-3 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 text-text-main dark:text-white">
                        <div className="size-8 flex items-center justify-center bg-primary/20 rounded-lg text-primary">
                            <span className="material-symbols-outlined">storefront</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-tight">Bake & Pack POS</h2>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
                <div className="w-full max-w-xl bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-surface-dark overflow-hidden p-6 sm:p-10">
                    <div className="w-full max-w-md mx-auto">
                        {/* Heading */}
                        <div className="mb-8 text-center">
                            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl text-primary">person_add</span>
                            </div>
                            <h2 className="text-text-main dark:text-white text-2xl font-black leading-tight tracking-[-0.033em] mb-2">Complete Your Profile</h2>
                            <p className="text-text-muted text-base font-normal">
                                Welcome, <span className="font-semibold text-text-main dark:text-white">{user?.name || user?.email}</span>!
                                <br />Please complete your profile to continue.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
                                {error}
                            </div>
                        )}

                        <form className="flex flex-col gap-5" onSubmit={handleComplete}>
                            {/* Role Selector */}
                            <div className="flex flex-col gap-2">
                                <label className="text-text-main dark:text-white text-sm font-medium" htmlFor="role">What is your role?</label>
                                <select
                                    className="form-select w-full rounded-lg text-text-main dark:text-white bg-background-light dark:bg-background-dark border border-border-color dark:border-surface-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base appearance-none cursor-pointer"
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="admin">Admin - I want to create a new store</option>
                                    <option value="manager">Manager - I want to join an existing store</option>
                                    <option value="cashier">Cashier - I want to join an existing store</option>
                                </select>
                            </div>

                            {/* Conditional: Store Info for Admin OR Invite Code for others */}
                            <div className="pt-4 border-t border-border-color dark:border-surface-dark">
                                {isAdmin ? (
                                    <>
                                        <h3 className="text-text-main dark:text-white text-sm font-bold mb-4">Store Information</h3>

                                        {/* Store Name */}
                                        <div className="flex flex-col gap-2 mb-4">
                                            <label className="text-text-main dark:text-white text-sm font-medium" htmlFor="storeName">Store Name</label>
                                            <input
                                                className="form-input w-full rounded-lg text-text-main dark:text-white bg-background-light dark:bg-background-dark border border-border-color dark:border-surface-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 placeholder:text-text-muted/60 text-base"
                                                id="storeName"
                                                placeholder="My Bakery Store"
                                                type="text"
                                                value={storeName}
                                                onChange={(e) => setStoreName(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Store Address */}
                                        <div className="flex flex-col gap-2 mb-4">
                                            <label className="text-text-main dark:text-white text-sm font-medium" htmlFor="storeAddress">Store Address</label>
                                            <input
                                                className="form-input w-full rounded-lg text-text-main dark:text-white bg-background-light dark:bg-background-dark border border-border-color dark:border-surface-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 placeholder:text-text-muted/60 text-base"
                                                id="storeAddress"
                                                placeholder="123 Main Street, City"
                                                type="text"
                                                value={storeAddress}
                                                onChange={(e) => setStoreAddress(e.target.value)}
                                            />
                                        </div>

                                        {/* Store Phone */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-text-main dark:text-white text-sm font-medium" htmlFor="storePhone">Store Phone</label>
                                            <input
                                                className="form-input w-full rounded-lg text-text-main dark:text-white bg-background-light dark:bg-background-dark border border-border-color dark:border-surface-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 placeholder:text-text-muted/60 text-base"
                                                id="storePhone"
                                                placeholder="+62 812 3456 7890"
                                                type="tel"
                                                value={storePhone}
                                                onChange={(e) => setStorePhone(e.target.value)}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-text-main dark:text-white text-sm font-bold mb-4">Join a Store</h3>
                                        <p className="text-text-muted text-sm mb-4">Ask your admin for the store invite code to join their store.</p>

                                        {/* Invite Code */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-text-main dark:text-white text-sm font-medium" htmlFor="inviteCode">Store Invite Code</label>
                                            <input
                                                className="form-input w-full rounded-lg text-text-main dark:text-white bg-background-light dark:bg-background-dark border border-border-color dark:border-surface-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 placeholder:text-text-muted/60 text-base uppercase tracking-widest font-mono"
                                                id="inviteCode"
                                                placeholder="ABC12345"
                                                type="text"
                                                maxLength={8}
                                                value={inviteCode}
                                                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                                required
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-primary/90 text-background-dark text-base font-bold leading-normal tracking-[0.015em] mt-2 shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={loading}
                            >
                                <span className="truncate">{loading ? 'Setting up...' : 'Complete Setup'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CompleteProfile;
