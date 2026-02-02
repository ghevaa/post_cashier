import React from 'react';

const PosHeader = ({ onMenuClick }) => {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-secondary-green dark:border-secondary-green-dark px-6 py-3 bg-background-light dark:bg-background-dark shrink-0">
            <div className="flex items-center gap-4">
                <button
                    className="md:hidden text-text-main dark:text-white p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                    onClick={onMenuClick}
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-text-main">
                    <span className="material-symbols-outlined">storefront</span>
                </div>
                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-main dark:text-white">Bake & Pack POS</h2>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                </span>
            </div>
            <div className="flex gap-3">
                <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-secondary-green dark:bg-secondary-green-dark hover:bg-green-200 dark:hover:bg-green-900 transition-colors text-text-main dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] px-4">
                    <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                    <span className="hidden sm:inline">Pending Orders</span>
                    <span className="bg-primary text-text-main text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </button>
                <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-secondary-green dark:bg-secondary-green-dark hover:bg-green-200 dark:hover:bg-green-900 transition-colors text-text-main dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] px-3">
                    <span className="material-symbols-outlined text-[20px]">account_circle</span>
                    <div className="flex flex-col items-start text-xs leading-none hidden sm:flex">
                        <span>Jane Doe</span>
                        <span className="font-normal opacity-70">Cashier</span>
                    </div>
                </button>
            </div>
        </header>
    );
};

export default PosHeader;
