import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main font-display antialiased overflow-hidden h-screen flex">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                {children}
            </main>
        </div>
    );
};

export default Layout;
