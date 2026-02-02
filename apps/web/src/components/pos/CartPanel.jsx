import React, { useMemo, useState } from 'react';
import { api } from '../../lib/api';
import { v4 as uuidv4 } from 'uuid';
import { useCurrency } from '../../contexts/StoreContext';

const CartPanel = ({ cartItems, onUpdateQuantity, onRemove, onClear, onPay }) => {
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash'); // cash, midtrans
    const { formatCurrency } = useCurrency();

    const { subtotal, total } = useMemo(() => {
        const sub = cartItems.reduce((acc, item) => {
            const price = item.sellingPrice || parseFloat(String(item.price).replace('$', '')) || 0;
            return acc + (price * item.qty);
        }, 0);
        return { subtotal: sub, total: sub * 0.95 }; // 5% discount
    }, [cartItems]);

    // Handle Midtrans payment
    const handleMidtransPayment = async () => {
        if (cartItems.length === 0) return;

        setPaymentLoading(true);
        try {
            const orderId = uuidv4();

            // Prepare items for Midtrans
            const items = cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: Math.round(item.sellingPrice || parseFloat(String(item.price).replace('$', '')) || 0),
                quantity: item.qty,
            }));

            // Create Snap token
            const { token } = await api.payments.createSnapToken({
                orderId,
                grossAmount: Math.round(total),
                items,
                customer: {
                    firstName: 'Customer',
                },
            });

            // Open Midtrans Snap popup
            if (window.snap) {
                window.snap.pay(token, {
                    onSuccess: function (result) {
                        console.log('Payment success:', result);
                        // Create transaction record
                        handlePaymentSuccess(orderId);
                    },
                    onPending: function (result) {
                        console.log('Payment pending:', result);
                        alert('Pembayaran tertunda. Silakan selesaikan pembayaran.');
                    },
                    onError: function (result) {
                        console.error('Payment error:', result);
                        alert('Pembayaran gagal. Silakan coba lagi.');
                    },
                    onClose: function () {
                        console.log('Customer closed the popup without finishing the payment');
                    }
                });
            } else {
                alert('Midtrans Snap tidak tersedia. Pastikan koneksi internet stabil.');
            }
        } catch (error) {
            console.error('Failed to create payment:', error);
            alert('Gagal memproses pembayaran: ' + error.message);
        } finally {
            setPaymentLoading(false);
        }
    };

    // Handle successful Midtrans payment
    const handlePaymentSuccess = async (orderId) => {
        try {
            // Create transaction in our system
            const items = cartItems.map(item => ({
                productId: item.id,
                quantity: item.qty,
            }));

            await api.transactions.create({
                items,
                paymentType: 'transfer', // Digital payment
                notes: `Midtrans Order: ${orderId}`,
            });

            onClear(); // Clear cart
            alert('Pembayaran berhasil! Transaksi telah dicatat.');
        } catch (error) {
            console.error('Failed to create transaction:', error);
        }
    };

    // Handle cash payment
    const handleCashPayment = () => {
        if (onPay) {
            onPay(total);
        }
    };

    return (
        <aside className="w-full md:w-[420px] flex flex-col bg-surface-light dark:bg-surface-dark border-l border-secondary-green dark:border-secondary-green-dark shadow-2xl z-20 absolute md:relative right-0 h-full">
            {/* Cart Header */}
            <div className="px-5 py-4 border-b border-secondary-green dark:border-secondary-green-dark flex justify-between items-center bg-background-light/50 dark:bg-background-dark/50">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">shopping_cart</span>
                    <h3 className="font-bold text-lg text-text-main dark:text-white">Current Order</h3>
                    <span className="bg-secondary-green dark:bg-secondary-green-dark text-text-muted text-xs px-2 py-0.5 rounded-full font-mono">#{cartItems.length}</span>
                </div>
                <button onClick={onClear} className="text-text-muted hover:text-red-500 text-sm font-medium transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Clear
                </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-text-muted">
                        <span className="material-symbols-outlined text-5xl mb-2">shopping_cart</span>
                        <p className="text-sm">Keranjang kosong</p>
                    </div>
                ) : (
                    cartItems.map((item) => {
                        const price = item.sellingPrice || parseFloat(String(item.price).replace('$', '')) || 0;
                        return (
                            <div key={item.id} className="flex items-start gap-3 group">
                                <div className="w-12 h-12 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-gray-400">inventory_2</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-sm font-bold text-text-main dark:text-white truncate">{item.name}</p>
                                        <p className="text-sm font-bold text-text-main dark:text-white">{formatCurrency(price)}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-text-muted">{item.qty} x {formatCurrency(price)}</p>
                                        <div className="flex items-center gap-2 bg-secondary-green dark:bg-secondary-green-dark rounded-md p-0.5">
                                            <button onClick={() => onUpdateQuantity(item.id, -1)} className="size-6 flex items-center justify-center rounded bg-white dark:bg-black/20 hover:text-red-500 transition-colors">
                                                <span className="material-symbols-outlined text-[16px] text-text-main dark:text-white">remove</span>
                                            </button>
                                            <span className="text-sm font-mono w-4 text-center text-text-main dark:text-white">{item.qty}</span>
                                            <button onClick={() => onUpdateQuantity(item.id, 1)} className="size-6 flex items-center justify-center rounded bg-white dark:bg-black/20 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-[16px] text-text-main dark:text-white">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer Section */}
            <div className="bg-background-light dark:bg-[#15251b] p-5 border-t border-secondary-green dark:border-secondary-green-dark space-y-4">
                {/* Calculations */}
                <div className="space-y-2 pb-4 border-b border-secondary-green dark:border-secondary-green-dark/50 border-dashed">
                    <div className="flex justify-between text-sm text-text-muted">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-text-muted">
                        <span>Diskon (5%)</span>
                        <span className="text-primary">-{formatCurrency(subtotal * 0.05)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-base font-medium text-text-main dark:text-white">Total</span>
                        <span className="text-2xl font-bold text-text-main dark:text-white">{formatCurrency(total)}</span>
                    </div>
                </div>

                {/* Payment Methods */}
                <div>
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Metode Pembayaran</label>
                    <div className="grid grid-cols-2 gap-2">
                        {/* Cash Payment */}
                        <button
                            onClick={handleCashPayment}
                            disabled={cartItems.length === 0}
                            className="h-14 flex flex-col items-center justify-center gap-1 rounded-lg bg-primary text-text-main hover:brightness-110 font-bold shadow-lg shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined">payments</span>
                            <span className="text-xs">Tunai</span>
                        </button>

                        {/* Midtrans Digital Payment */}
                        <button
                            onClick={handleMidtransPayment}
                            disabled={cartItems.length === 0 || paymentLoading}
                            className="h-14 flex flex-col items-center justify-center gap-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {paymentLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">credit_card</span>
                                    <span className="text-xs">Digital</span>
                                </>
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-text-muted mt-2 text-center">
                        Digital: QRIS, Transfer Bank, E-Wallet, Kartu Kredit
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <button className="flex-1 h-12 flex items-center justify-center rounded-lg border border-primary text-primary hover:bg-primary/10 font-bold transition-colors">
                        Simpan Order
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default CartPanel;
