import React from 'react';

const PaymentMethods = () => {
    return (
        <section className="bg-white dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-800 shadow-sm overflow-hidden mb-12">
            <div className="px-6 py-4 border-b border-border-color dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">credit_card</span>
                    <h2 className="text-text-main dark:text-white text-lg font-bold">Payment Methods</h2>
                </div>
            </div>
            <div className="divide-y divide-border-color dark:divide-gray-800">
                {/* Payment Item 1 */}
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <div>
                            <p className="font-semibold text-text-main dark:text-white">Cash Payments</p>
                            <p className="text-sm text-text-muted">Accept physical currency</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input defaultChecked className="sr-only peer" disabled type="checkbox" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary opacity-60 cursor-not-allowed"></div>
                    </label>
                </div>
                {/* Payment Item 2 */}
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                            <span className="material-symbols-outlined">credit_card</span>
                        </div>
                        <div>
                            <p className="font-semibold text-text-main dark:text-white">Credit & Debit Cards</p>
                            <p className="text-sm text-text-muted">Visa, Mastercard, Amex</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input defaultChecked className="sr-only peer" type="checkbox" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
                {/* Payment Item 3 */}
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                            <span className="material-symbols-outlined">qr_code_scanner</span>
                        </div>
                        <div>
                            <p className="font-semibold text-text-main dark:text-white">Digital Wallets & QR</p>
                            <p className="text-sm text-text-muted">Apple Pay, Google Pay</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input className="sr-only peer" type="checkbox" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>
        </section>
    );
};

export default PaymentMethods;
