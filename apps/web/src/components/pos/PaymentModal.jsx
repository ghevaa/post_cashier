import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../contexts/StoreContext';

const PaymentModal = ({ isOpen, onClose, total, onComplete }) => {
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [amountReceived, setAmountReceived] = useState('');
    const [changeDue, setChangeDue] = useState(0);
    const { formatCurrency, currency } = useCurrency();

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setAmountReceived('');
            setChangeDue(0);
            setPaymentMethod('Cash');
        }
    }, [isOpen]);

    // Update change due when amount received changes
    useEffect(() => {
        const received = parseFloat(amountReceived) || 0;
        setChangeDue(received - total);
    }, [amountReceived, total]);

    if (!isOpen) return null;

    const handleQuickAmount = (amount) => {
        if (amount === 'exact') {
            setAmountReceived(total.toString());
        } else {
            setAmountReceived(amount.toString());
        }
    };

    const handleComplete = () => {
        onComplete({
            method: paymentMethod,
            received: parseFloat(amountReceived) || 0,
            change: changeDue
        });
    };

    // Get currency symbol for display
    const currencySymbol = currency === 'IDR' ? 'Rp' : currency === 'USD' ? '$' : currency;
    const quickAmounts = currency === 'IDR' ? [10000, 20000, 50000, 100000] : [10, 20, 50, 100];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden font-display p-4 md:p-0">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative z-50 w-full max-w-[580px] bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl border border-border-color dark:border-gray-800 flex flex-col overflow-hidden animate-fade-in-up">

                {/* Header Section */}
                <div className="p-6 border-b border-border-color dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-black/20">
                    <div>
                        <h1 className="text-xl font-bold text-text-main dark:text-white">Payment Details</h1>
                        <p className="text-sm text-text-muted">Transaction #TRX-{Math.floor(Math.random() * 10000)}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                {/* Total Amount Display */}
                <div className="px-8 py-6 text-center bg-primary/5 dark:bg-primary/10">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Due</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-text-main dark:text-white tracking-tight">{formatCurrency(total)}</h2>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                    {/* Payment Method Segmented Buttons */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-main dark:text-gray-300">Payment Method</label>
                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                            {['Cash', 'Transfer', 'Card'].map((method) => (
                                <label key={method} className="flex-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value={method}
                                        className="peer sr-only"
                                        checked={paymentMethod === method}
                                        onChange={() => setPaymentMethod(method)}
                                    />
                                    <div className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-md transition-all duration-200 text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5 peer-checked:bg-white dark:peer-checked:bg-secondary-green-dark peer-checked:shadow-sm peer-checked:text-primary font-semibold">
                                        <span className="material-symbols-outlined text-xl">
                                            {method === 'Cash' ? 'payments' : method === 'Transfer' ? 'qr_code_scanner' : 'credit_card'}
                                        </span>
                                        <span>{method}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Input & Quick Amounts */}
                    <div className="flex flex-col gap-4">
                        <label className="block">
                            <span className="text-sm font-medium text-text-main dark:text-gray-300 mb-1 block">Amount Received</span>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-400 dark:text-gray-500 font-semibold">{currencySymbol}</span>
                                </div>
                                <input
                                    type="number"
                                    autoFocus
                                    value={amountReceived}
                                    onChange={(e) => setAmountReceived(e.target.value)}
                                    className="block w-full pl-8 pr-4 py-4 rounded-lg bg-gray-50 dark:bg-gray-800 border-border-color dark:border-gray-700 text-text-main dark:text-white text-2xl font-bold focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none placeholder:text-gray-300"
                                    placeholder="0.00"
                                />
                            </div>
                        </label>

                        {/* Quick Amount Chips */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleQuickAmount('exact')}
                                className="flex-1 min-w-[80px] py-2 px-3 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 text-text-main dark:text-gray-200 text-sm font-medium transition-colors"
                            >
                                Exact
                            </button>
                            {quickAmounts.map(amt => (
                                <button
                                    key={amt}
                                    onClick={() => handleQuickAmount(amt)}
                                    className="flex-1 min-w-[80px] py-2 px-3 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 text-text-main dark:text-gray-200 text-sm font-medium transition-colors"
                                >
                                    {currencySymbol}{amt.toLocaleString()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Change Stats */}
                    <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-4 flex items-center justify-between bg-gray-50/50 dark:bg-black/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                <span className="material-symbols-outlined">currency_exchange</span>
                            </div>
                            <span className="text-gray-600 dark:text-gray-300 font-medium">Change Due</span>
                        </div>
                        <div className="text-right">
                            <p className={`text-2xl font-bold ${changeDue < 0 ? 'text-red-500' : 'text-text-main dark:text-white'}`}>
                                {formatCurrency(Math.max(0, changeDue))}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-border-color dark:border-gray-800 bg-white dark:bg-surface-dark flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 px-6 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleComplete}
                        disabled={changeDue < 0 && paymentMethod === 'Cash'}
                        className="flex-[2] py-3.5 px-6 rounded-lg bg-primary hover:bg-[#0fd650] text-black font-bold shadow-lg shadow-primary/30 transition-all hover:shadow-primary/40 focus:ring-4 focus:ring-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined">check_circle</span>
                        Complete Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
