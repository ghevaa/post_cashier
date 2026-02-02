import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchStore();
        } else {
            setStore(null);
            setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchStore = async () => {
        try {
            setLoading(true);
            const storeData = await api.store.get();
            setStore(storeData);
        } catch (error) {
            console.error('Failed to fetch store:', error);
            setStore(null);
        } finally {
            setLoading(false);
        }
    };

    const updateStore = async (data) => {
        try {
            const updated = await api.store.update(data);
            setStore(updated);
            return updated;
        } catch (error) {
            console.error('Failed to update store:', error);
            throw error;
        }
    };

    // Format currency based on store settings
    const formatCurrency = (value) => {
        const currency = store?.currency || 'IDR';
        const locale = currency === 'IDR' ? 'id-ID' : currency === 'USD' ? 'en-US' : 'en-US';

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: currency === 'IDR' ? 0 : 2,
            maximumFractionDigits: currency === 'IDR' ? 0 : 2,
        }).format(value || 0);
    };

    const value = {
        store,
        loading,
        currency: store?.currency || 'IDR',
        formatCurrency,
        updateStore,
        refreshStore: fetchStore,
    };

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}

// Custom hook specifically for currency formatting
export function useCurrency() {
    const { formatCurrency, currency } = useStore();
    return { formatCurrency, currency };
}

export default StoreContext;
