import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PendingApproval = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error('Logout failed:', err);
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
                    <button
                        onClick={handleLogout}
                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold transition-colors"
                    >
                        <span className="truncate">Logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
                <div className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-surface-dark p-8 text-center">
                    {/* Pending Icon */}
                    <div className="mx-auto mb-6 size-20 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                        <span className="material-symbols-outlined text-5xl text-yellow-600 dark:text-yellow-400">hourglass_empty</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-text-main dark:text-white text-2xl font-black leading-tight tracking-tight mb-2">
                        Waiting for Approval
                    </h1>

                    {/* Description */}
                    <p className="text-text-muted text-base mb-6">
                        Your account is pending approval from the store admin. You'll be able to access the dashboard once your request has been approved.
                    </p>

                    {/* Info Box */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800 mb-6">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">info</span>
                            <div className="text-left">
                                <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">What happens next?</p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                                    The store admin will review your registration request. Once approved, you can log in again to access the system.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full flex items-center justify-center gap-2 rounded-lg h-12 px-4 bg-primary hover:bg-primary/90 text-background-dark text-base font-bold transition-colors"
                        >
                            <span className="material-symbols-outlined">refresh</span>
                            Check Status Again
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 rounded-lg h-12 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-text-main dark:text-white text-base font-medium transition-colors"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            Logout
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PendingApproval;
