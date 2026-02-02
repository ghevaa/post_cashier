import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const userRole = user?.role || 'cashier';

    // Define all menu items with their allowed roles
    const menuItems = [
        { to: '/', icon: 'dashboard', label: 'Dashboard', roles: ['admin'] },
        { to: '/inventory', icon: 'inventory_2', label: 'Inventory', roles: ['admin', 'manager'] },
        { to: '/pos', icon: 'point_of_sale', label: 'POS Register', roles: ['admin', 'cashier'] },
        { to: '/suppliers', icon: 'local_shipping', label: 'Suppliers', roles: ['admin'] },
        { to: '/reports', icon: 'bar_chart', label: 'Reports', roles: ['admin', 'manager'] },
    ];

    // Filter menu items based on user role
    const visibleMenuItems = menuItems.filter(item => item.roles.includes(userRole));

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg group transition-colors ${isActive ? 'bg-secondary-green dark:bg-primary/20' : 'hover:bg-secondary-green dark:hover:bg-primary/10'}`;

    const iconClass = ({ isActive }) =>
        `material-symbols-outlined transition-colors ${isActive ? 'text-text-main dark:text-white icon-fill' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary'}`;

    const textClass = ({ isActive }) =>
        `text-sm font-medium transition-colors ${isActive ? 'text-text-main dark:text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary'}`;

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-background-light dark:bg-surface-dark border-r border-border-color flex flex-col h-full transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 flex flex-col gap-8 h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="bg-center bg-no-repeat bg-cover rounded-full size-10 flex-shrink-0"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB3UVh_8WE99Hr_CTNpL-DMEu_PgsWzNxqfKbHDuEmsolS5wFAhrv0AGR1Ulpzj1bzFoK0CRXpYcGNpe0sNJH3fckIu9znpFgP8mujwnlYHfKyI3yT01p3xpExbuAQyZZD4j5NsnYOBuXBWsrvornUCGIxfXK5BnICR4tjO4Z0DEeVuHh5X_iJoDrJ4GhQS3A7TtowveJBeuw91Rp2agaq19urdvHIpHRtSfjhlOC2YRsqSwRIRlgPOWIpjJKVyfV-7iAgePbem7Fg")' }}
                            ></div>
                            <div className="flex flex-col">
                                <h1 className="text-text-main text-lg font-bold leading-none">BakerPlast</h1>
                                <p className="text-text-muted text-xs font-medium">POS Admin</p>
                            </div>
                        </div>
                        {/* Close Button (Mobile Only) */}
                        <button onClick={onClose} className="md:hidden p-1 text-text-muted hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-2 flex-1">
                        {visibleMenuItems.map((item) => (
                            <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
                                {({ isActive }) => (
                                    <>
                                        <span className={iconClass({ isActive })}>{item.icon}</span>
                                        <span className={textClass({ isActive })}>{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Bottom Settings - Only show for admin */}
                    <div className="flex flex-col gap-2 mt-auto">
                        {userRole === 'admin' && (
                            <NavLink to="/settings" className={linkClass} onClick={onClose}>
                                {({ isActive }) => (
                                    <>
                                        <span className={iconClass({ isActive })}>settings</span>
                                        <span className={textClass({ isActive })}>Settings</span>
                                    </>
                                )}
                            </NavLink>
                        )}
                        <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                            <span className="material-symbols-outlined">logout</span>
                            <span className="text-sm font-medium">Logout</span>
                        </a>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

