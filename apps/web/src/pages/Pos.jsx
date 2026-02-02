import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import ProductCatalog from '../components/pos/ProductCatalog';
import CartPanel from '../components/pos/CartPanel';
import PaymentModal from '../components/pos/PaymentModal';
import api from '../lib/api';

const Pos = () => {
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [currentOrderTotal, setCurrentOrderTotal] = useState(0);
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoadingProducts(true);
            const result = await api.products.list({ limit: 100 });
            setProducts(result.data || []);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoadingProducts(false);
        }
    };

    const addToCart = useCallback((product) => {
        setCartItems(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                // Check stock
                if (existing.qty >= (product.stock || 999)) {
                    return prev;
                }
                return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    }, []);

    const updateQuantity = useCallback((productId, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(0, Math.min(item.stock || 999, item.qty + delta));
                return { ...item, qty: newQty };
            }
            return item;
        }).filter(item => item.qty > 0));
    }, []);

    const handlePay = (total) => {
        setCurrentOrderTotal(total);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentComplete = async (details) => {
        if (cartItems.length === 0) return;

        setProcessingPayment(true);
        try {
            // Create transaction via API
            const transactionData = {
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.qty,
                })),
                paymentType: details.method.toLowerCase(),
                discount: currentOrderTotal / 0.95 * 0.05,
                amountReceived: details.received,
            };

            await api.transactions.create(transactionData);

            setIsPaymentModalOpen(false);
            setCartItems([]);

            // Refresh products to update stock
            fetchProducts();

            // Show success message
            alert('Payment completed successfully!');
        } catch (err) {
            console.error('Payment failed:', err);
            alert('Payment failed: ' + err.message);
        } finally {
            setProcessingPayment(false);
        }
    };

    return (
        <Layout>
            <div className="flex-1 flex overflow-hidden relative">
                <ProductCatalog
                    products={products}
                    loading={loadingProducts}
                    onAddToCart={addToCart}
                />
                {cartItems.length > 0 && (
                    <CartPanel
                        cartItems={cartItems}
                        onUpdateQuantity={updateQuantity}
                        onRemove={(productId) => updateQuantity(productId, -100)}
                        onClear={() => setCartItems([])}
                        onPay={handlePay}
                    />
                )}
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                total={currentOrderTotal}
                onComplete={handlePaymentComplete}
                processing={processingPayment}
            />
        </Layout>
    );
};

export default Pos;
