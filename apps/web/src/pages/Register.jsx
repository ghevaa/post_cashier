import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register, signInWithGoogle } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('cashier');
    const [storeName, setStoreName] = useState('');
    const [storeAddress, setStoreAddress] = useState('');
    const [storePhone, setStorePhone] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isAdmin = role === 'admin';

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        // Validation based on role
        if (!isAdmin && !inviteCode.trim()) {
            setError('Please enter the store invite code from your admin');
            return;
        }

        setLoading(true);

        try {
            // Pass different data based on role
            const registrationData = isAdmin
                ? { storeName, storeAddress, storePhone }
                : { inviteCode: inviteCode.toUpperCase().trim() };

            await register(name, email, password, role, registrationData);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
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
                    <Link to="/login" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary/10 hover:bg-primary/20 text-text-main dark:text-white text-sm font-bold transition-colors">
                        <span className="truncate">Login</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
                <div className="w-full max-w-6xl bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-surface-dark overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                    {/* Left Side: Image/Branding */}
                    <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-gray-100 dark:bg-gray-800 flex-col justify-end p-8 md:p-12">
                        <div className="absolute inset-0 z-0">
                            <img
                                alt="Bakery counter with fresh ingredients and payment terminal"
                                className="w-full h-full object-cover opacity-90"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRde_KwCuq9nDXZVRZ7c5424XSv_mrrEaodfIWOxI_8VmKQLPEXUb4Mg2dQDOEmbJje5AlroGaupOREWoBD_9lTMBDhqZLEGiYdXuzc6kvgTsLv-BhyTuO5-nPbV3GL7uSZCmcjSxQEhErw4u3PhmCLyQWDNEyLkbbcAGQzI3_La-pcmbxyf0eQ_AbVnMbMjEDlUWwEEI6YCJ_r7orQ0uULbAGdWz6qB2xurgPl5dCwoHKyH_fAwecIQGiE-3akdXLBagO1CRkqDw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/40 to-transparent"></div>
                        </div>
                        <div className="relative z-10 text-white">
                            <div className="mb-4 inline-flex items-center justify-center size-12 rounded-full bg-primary text-background-dark">
                                <span className="material-symbols-outlined text-2xl">inventory_2</span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-black leading-tight mb-3">Manage your store with ease</h1>
                            <p className="text-gray-200 text-lg font-medium leading-relaxed">The all-in-one POS solution for plastic supplies and baking ingredients.</p>
                        </div>
                    </div>

                    {/* Right Side: Registration Form */}
                    <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col justify-center p-6 sm:p-10 lg:p-16">
                        <div className="w-full max-w-md mx-auto">
                            {/* Page Heading Component */}
                            <div className="mb-8">
                                <h2 className="text-text-main dark:text-white text-3xl font-black leading-tight tracking-[-0.033em] mb-2">Create your account</h2>
                                <p className="text-text-muted text-base font-normal">Start managing your inventory today.</p>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
                                    {error}
                                </div>
                            )}

                            <form className="flex flex-col gap-5" onSubmit={handleRegister}>
                                {/* Full Name TextField */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-text-main dark:text-white text-sm font-medium" htmlFor="fullname">Full Name</label>
                                    <input
                                        className="form-input w-full rounded-lg text-text-main dark:text-white bg-background-light dark:bg-background-dark border border-border-color dark:border-surface-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 placeholder:text-text-muted/60 text-base"
                                        id="fullname"
                                        placeholder="Jane Doe"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Email TextField */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-text-main dark:text-white text-sm font-medium" htmlFor="email">Email Address</label>
                                    <input
                                        className="form-input w-full rounded-lg text-text-main dark:text-white bg-background-light dark:bg-background-dark border border-border-color dark:border-surface-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 placeholder:text-text-muted/60 text-base"
                                        id="email"
                                        placeholder="jane@bakery.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Role Selector */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-text-main dark:text-white text-sm font-medium" htmlFor="role">Role</label>
                                    <select
                                        className="form-select w-full rounded-lg text-text-main dark:text-white bg-background-light dark:bg-background-dark border border-border-color dark:border-surface-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base appearance-none cursor-pointer"
                                        id="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="admin">Admin - Full access to all features</option>
                                        <option value="manager">Manager - Reports and inventory</option>
                                        <option value="cashier">Cashier - POS operations only</option>
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
                                                    required
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
                                                    required
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

                                {/* Password TextField */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-text-main dark:text-white text-sm font-medium" htmlFor="password">Password</label>
                                    <div className="relative w-full">
                                        <input
                                            className="form-input w-full rounded-lg text-text-main dark:text-white bg-background-light dark:bg-background-dark border border-border-color dark:border-surface-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-4 pr-12 placeholder:text-text-muted/60 text-base"
                                            id="password"
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            className="absolute right-0 top-0 h-full px-4 text-text-muted hover:text-primary transition-colors flex items-center justify-center"
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                {showPassword ? 'visibility_off' : 'visibility'}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password TextField */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-text-main dark:text-white text-sm font-medium" htmlFor="confirm-password">Confirm Password</label>
                                    <div className="relative w-full">
                                        <input
                                            className="form-input w-full rounded-lg text-text-main dark:text-white bg-background-light dark:bg-background-dark border border-border-color dark:border-surface-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-4 pr-12 placeholder:text-text-muted/60 text-base"
                                            id="confirm-password"
                                            placeholder="••••••••"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            className="absolute right-0 top-0 h-full px-4 text-text-muted hover:text-primary transition-colors flex items-center justify-center"
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-primary/90 text-background-dark text-base font-bold leading-normal tracking-[0.015em] mt-2 shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="submit"
                                    disabled={loading}
                                >
                                    <span className="truncate">{loading ? 'Creating account...' : 'Register Account'}</span>
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border-color dark:border-surface-dark"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-surface-light dark:bg-surface-dark px-2 text-text-muted">Or continue with</span>
                                </div>
                            </div>

                            {/* Google Sign-Up Button */}
                            <button
                                type="button"
                                onClick={signInWithGoogle}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border-color dark:border-surface-dark rounded-lg shadow-sm text-sm font-medium text-text-main dark:text-white bg-white dark:bg-black/20 hover:bg-gray-50 dark:hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Sign up with Google
                            </button>

                            {/* Footer Link */}
                            <div className="mt-6 text-center">
                                <p className="text-text-muted text-sm">
                                    Already have an account?
                                    <Link to="/login" className="text-text-main dark:text-white font-bold hover:text-primary dark:hover:text-primary underline decoration-primary/50 hover:decoration-primary transition-colors ml-1">Log In</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;
