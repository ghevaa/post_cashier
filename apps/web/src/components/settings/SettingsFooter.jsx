import React from 'react';
import { printContent } from '../../lib/exportUtils';

const SettingsFooter = ({ storeInfo, onSave, onCancel, lastSaved }) => {
    const handlePrint = () => {
        const content = `
            <h2>Store Information</h2>
            <table>
                <tr><td><strong>Store Name:</strong></td><td>${storeInfo?.name || 'N/A'}</td></tr>
                <tr><td><strong>Address:</strong></td><td>${storeInfo?.address || 'N/A'}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>${storeInfo?.phone || 'N/A'}</td></tr>
                <tr><td><strong>Currency:</strong></td><td>${storeInfo?.currency || 'IDR'}</td></tr>
                <tr><td><strong>Timezone:</strong></td><td>${storeInfo?.timezone || 'Asia/Jakarta'}</td></tr>
            </table>
        `;
        printContent('Store Configuration', content, { storeName: storeInfo?.name || 'Store' });
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-border-color dark:border-gray-800 px-8 py-4 flex items-center justify-between z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <span className="text-sm text-text-muted dark:text-gray-400 hidden sm:block">
                {lastSaved || 'Last saved: Today at 09:42 AM'}
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                    onClick={handlePrint}
                    className="px-4 py-2.5 rounded-lg border border-border-color dark:border-gray-600 text-text-main dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">print</span>
                    Print
                </button>
                <button
                    onClick={onCancel}
                    className="px-6 py-2.5 rounded-lg border border-border-color dark:border-gray-600 text-text-main dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onSave}
                    className="px-6 py-2.5 rounded-lg bg-primary hover:bg-[#0fd650] text-[#0d1b12] font-bold shadow-sm transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[20px]">check</span>
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default SettingsFooter;
