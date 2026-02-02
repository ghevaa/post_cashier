import React from 'react';

const ReportsHeader = ({ dateRange = '30days', onDateRangeChange, onPrint, onExport }) => {
    const handleChange = (e) => {
        if (onDateRangeChange) {
            onDateRangeChange(e.target.value);
        }
    };

    return (
        <header className="w-full px-6 py-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-border-color dark:border-gray-800 bg-background-light dark:bg-background-dark z-10 sticky top-0">
            <div className="flex flex-col gap-1">
                <h2 className="text-text-main dark:text-white text-2xl lg:text-3xl font-black tracking-tight">Sales and Profit Reports</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Analyze your store performance and inventory turnover.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                {/* Date Range Picker */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400">calendar_today</span>
                    </div>
                    <select
                        value={dateRange}
                        onChange={handleChange}
                        className="pl-10 pr-10 py-2.5 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-surface-dark text-text-main dark:text-white text-sm font-medium focus:ring-primary focus:border-primary cursor-pointer shadow-sm min-w-[180px] outline-none border"
                    >
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="this_month">This Month</option>
                        <option value="last_month">Last Month</option>
                    </select>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={onPrint}
                        className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-700 dark:text-gray-200 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">print</span>
                        <span className="hidden sm:inline">Print</span>
                    </button>
                    <button
                        onClick={onExport}
                        className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary hover:bg-green-400 text-text-main text-sm font-bold shadow-sm shadow-primary/20 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        <span>Export Excel</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default ReportsHeader;
