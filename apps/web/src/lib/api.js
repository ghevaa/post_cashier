const API_BASE_URL = '/api/v1';

// Generic fetch wrapper with credentials for cookie-based auth
async function fetchAPI(endpoint, options = {}) {
    const config = {
        ...options,
        credentials: 'include', // Send cookies for Better Auth session
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
}

// API methods
export const api = {
    // Auth
    auth: {
        login: (email, password) => fetchAPI('/auth/sign-in/email', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),
        register: (name, email, password, role = 'cashier', data = {}) => fetchAPI('/auth/sign-up/email', {
            method: 'POST',
            body: JSON.stringify({
                name,
                email,
                password,
                role,
                storeName: data.storeName,
                storeAddress: data.storeAddress,
                storePhone: data.storePhone,
                inviteCode: data.inviteCode,
            }),
        }),
        logout: () => fetchAPI('/auth/sign-out', { method: 'POST' }),
        getSession: () => fetchAPI('/auth/get-session'),
    },

    // Products
    products: {
        list: (params = {}) => {
            const query = new URLSearchParams(params).toString();
            return fetchAPI(`/products${query ? `?${query}` : ''}`);
        },
        get: (id) => fetchAPI(`/products/${id}`),
        create: (data) => fetchAPI('/products', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        update: (id, data) => fetchAPI(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
        delete: (id) => fetchAPI(`/products/${id}`, { method: 'DELETE' }),
        lowStock: () => fetchAPI('/products/low-stock'),
    },

    // Categories
    categories: {
        list: (search = '') => {
            const query = search ? `?search=${encodeURIComponent(search)}` : '';
            return fetchAPI(`/categories${query}`);
        },
        get: (id) => fetchAPI(`/categories/${id}`),
        create: (data) => fetchAPI('/categories', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        update: (id, data) => fetchAPI(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
        delete: (id) => fetchAPI(`/categories/${id}`, { method: 'DELETE' }),
    },

    // Suppliers
    suppliers: {
        list: (params = {}) => {
            const query = new URLSearchParams(params).toString();
            return fetchAPI(`/suppliers${query ? `?${query}` : ''}`);
        },
        get: (id) => fetchAPI(`/suppliers/${id}`),
        create: (data) => fetchAPI('/suppliers', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        update: (id, data) => fetchAPI(`/suppliers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
        delete: (id) => fetchAPI(`/suppliers/${id}`, { method: 'DELETE' }),
    },

    // Transactions
    transactions: {
        list: (params = {}) => {
            const query = new URLSearchParams(params).toString();
            return fetchAPI(`/transactions${query ? `?${query}` : ''}`);
        },
        get: (id) => fetchAPI(`/transactions/${id}`),
        create: (data) => fetchAPI('/transactions', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    },

    // Store
    store: {
        get: () => fetchAPI('/stores/me'),
        update: (data) => fetchAPI('/stores/me', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    },

    // Users (Team Management)
    users: {
        team: () => fetchAPI('/users/team'),
        approve: (id) => fetchAPI(`/users/${id}/approve`, { method: 'PUT' }),
        reject: (id) => fetchAPI(`/users/${id}/reject`, { method: 'PUT' }),
        remove: (id) => fetchAPI(`/users/${id}`, { method: 'DELETE' }),
        completeProfile: (data) => fetchAPI('/users/complete-profile', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    },

    // Payments (Midtrans)
    payments: {
        getConfig: () => fetchAPI('/payments/config'),
        createSnapToken: (data) => fetchAPI('/payments/snap-token', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        checkStatus: (orderId) => fetchAPI(`/payments/${orderId}/status`),
    },

    // Dashboard
    dashboard: {
        stats: () => fetchAPI('/dashboard/stats'),
        salesChart: (days = 7) => fetchAPI(`/dashboard/sales-chart?days=${days}`),
        recentTransactions: (limit = 10) => fetchAPI(`/dashboard/recent-transactions?limit=${limit}`),
        reportsStats: (startDate, endDate) => {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            return fetchAPI(`/dashboard/reports-stats?${params.toString()}`);
        },
        bestSelling: (startDate, endDate, limit = 10) => {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            params.append('limit', limit.toString());
            return fetchAPI(`/dashboard/best-selling?${params.toString()}`);
        },
    },

    // Upload
    upload: {
        productImage: async (file) => {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${API_BASE_URL}/upload/product-image`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Upload failed' }));
                throw new Error(error.error || 'Upload failed');
            }

            return response.json();
        },
        deleteProductImage: (filename) => fetchAPI(`/upload/product-image/${filename}`, { method: 'DELETE' }),
        profileImage: async (file) => {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${API_BASE_URL}/upload/profile-image`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Upload failed' }));
                throw new Error(error.error || 'Upload failed');
            }

            return response.json();
        },
        deleteProfileImage: () => fetchAPI('/upload/profile-image', { method: 'DELETE' }),
    },
};

export default api;
