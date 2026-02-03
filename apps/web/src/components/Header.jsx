import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
};

const Header = ({ onMenuClick }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleProfileClick = () => {
        setDropdownOpen(false);
        navigate('/profile');
    };

    const handleSettingsClick = () => {
        setDropdownOpen(false);
        navigate('/settings');
    };

    const handleLogout = async () => {
        setDropdownOpen(false);
        await logout();
    };

    return (
        <header className="flex items-center justify-between border-b border-border-color bg-background-light dark:bg-background-dark dark:border-surface-dark px-6 py-4 flex-shrink-0">
            <div className="flex items-center gap-8 flex-1">
                {/* Mobile Menu Button (Hidden on Desktop) */}
                <button
                    className="md:hidden text-text-main p-1 rounded-md hover:bg-gray-100"
                    onClick={onMenuClick}
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h2 className="text-text-main dark:text-white text-xl font-bold leading-tight hidden sm:block">Dashboard Overview</h2>

                {/* Search */}
                <div className="flex flex-1 max-w-md h-10">
                    <div className="flex w-full items-stretch rounded-lg bg-[#e7f3eb] dark:bg-surface-dark overflow-hidden">
                        <div className="flex items-center justify-center pl-3 pr-1 text-text-muted">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                            className="w-full bg-transparent border-none text-text-main dark:text-white placeholder-text-muted text-sm focus:ring-0 focus:outline-none h-full"
                            placeholder="Search products, orders, or customers..."
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 ml-4">
                {/* New Sale Button */}
                <Link to="/pos" className="hidden sm:flex h-10 items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-dark transition-colors px-4 text-text-main font-bold shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span>New Sale</span>
                </Link>

                {/* Notifications */}
                <button className="flex items-center justify-center size-10 rounded-lg bg-[#e7f3eb] dark:bg-surface-dark hover:brightness-95 transition-all text-text-main dark:text-white relative">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white dark:border-surface-dark"></span>
                </button>

                {/* Profile with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all"
                        style={{ backgroundImage: user?.image ? `url("${getImageUrl(user.image)}")` : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDSdr8lnzWQAHY-aW_9PHgJ2FV0GSIe9iQnBEeksER1bXEvdpXhPWF-iX4KEojUYGmam9txYR9v70ye7Dqbbuxqnbo-EpOj_rzXolQc2yt6mcE-EpMoZo3f3Erx8UQ2ABiQP03ujE1LCTvcX8opnTi7sT3p9FWrPfcZouhTwmk83W7aplx2ZJgBO5AWocsI26sE1C2h9aH3qS3JlrKdOAJXq6m4V3VXPtTwWl5DlXJ9gDfsJ7VV9DgKGAmqeRrql3FYXFvmlECXyNQ")' }}
                    />

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-border-color dark:border-gray-700 py-2 z-50 animate-fadeIn">
                            {/* User Info */}
                            <div className="px-4 py-3 border-b border-border-color dark:border-gray-700">
                                <p className="text-sm font-semibold text-text-main dark:text-white truncate">{user?.name}</p>
                                <p className="text-xs text-text-muted dark:text-gray-400 truncate">{user?.email}</p>
                            </div>

                            {/* Menu Items */}
                            <div className="py-1">
                                <button
                                    onClick={handleProfileClick}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px] text-text-muted">person</span>
                                    Profile
                                </button>
                                <button
                                    onClick={handleSettingsClick}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px] text-text-muted">settings</span>
                                    Settings
                                </button>
                            </div>

                            {/* Logout */}
                            <div className="border-t border-border-color dark:border-gray-700 pt-1">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">logout</span>
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
