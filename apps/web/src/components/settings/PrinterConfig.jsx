import React from 'react';

const PrinterConfig = () => {
    return (
        <section className="bg-white dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border-color dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">print</span>
                    <h2 className="text-text-main dark:text-white text-lg font-bold">Printer Configuration</h2>
                </div>
            </div>
            <div className="p-6 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                    <label className="flex flex-col gap-2 flex-1 w-full">
                        <span className="text-text-main dark:text-gray-200 text-sm font-medium">Select Thermal Printer</span>
                        <div className="relative">
                            <select className="w-full appearance-none rounded-lg border-border-color dark:border-gray-700 bg-background-light dark:bg-gray-900 dark:text-white focus:border-primary focus:ring-0 h-12 px-4 text-base transition-colors cursor-pointer outline-none">
                                <option>EPSON TM-T88V (Connected)</option>
                                <option>Star Micronics TSP100</option>
                                <option>Brother QL-820NWB</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">arrow_drop_down</span>
                        </div>
                    </label>
                    <button className="h-12 px-6 rounded-lg border border-border-color dark:border-gray-600 text-text-main dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 whitespace-nowrap">
                        <span className="material-symbols-outlined text-sm">receipt_long</span>
                        Test Print
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Toggle 1 */}
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border-color dark:border-gray-700 bg-background-light dark:bg-gray-900/50">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-text-main dark:text-white">Auto-print Receipt</span>
                            <span className="text-xs text-text-muted dark:text-gray-400">Print immediately after payment</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input defaultChecked className="sr-only peer" type="checkbox" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                    {/* Toggle 2 */}
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border-color dark:border-gray-700 bg-background-light dark:bg-gray-900/50">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-text-main dark:text-white">Kitchen Ticket</span>
                            <span className="text-xs text-text-muted dark:text-gray-400">Print order details for bakery staff</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input className="sr-only peer" type="checkbox" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PrinterConfig;
