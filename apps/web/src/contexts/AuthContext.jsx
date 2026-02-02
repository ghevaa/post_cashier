import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { authClient } from '../lib/authClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Check session on mount
    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const session = await api.auth.getSession();
            if (session?.user) {
                setUser(session.user);
            }
        } catch (error) {
            // No valid session
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const result = await api.auth.login(email, password);
        // Session is handled via HTTP-only cookies by Better Auth
        if (result.user) {
            setUser(result.user);
        }
        return result;
    };

    const register = async (name, email, password, role = 'cashier', data = {}) => {
        const result = await api.auth.register(name, email, password, role, data);
        // Session is handled via HTTP-only cookies by Better Auth
        if (result.user) {
            setUser(result.user);
        }
        return result;
    };

    const logout = async () => {
        try {
            await api.auth.logout();
        } catch (error) {
            // Ignore logout errors
        }
        // Session cookie is cleared by the server
        setUser(null);
        navigate('/login');
    };

    const signInWithGoogle = async () => {
        // Use Better Auth client SDK for social sign-in
        await authClient.signIn.social({
            provider: 'google',
            callbackURL: window.location.origin,
        });
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkSession,
        signInWithGoogle,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Helper function to check if profile is incomplete (OAuth users who need to complete setup)
function isProfileIncomplete(user) {
    // If user has no storeId and no role, they need to complete their profile
    // This typically happens for new OAuth users
    return user && !user.storeId && (!user.role || user.role === 'cashier');
}

// Protected route wrapper
export function RequireAuth({ children }) {
    const { user, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const location = window.location.pathname;

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        } else if (!loading && isAuthenticated) {
            // Check if OAuth user needs to complete profile
            if (isProfileIncomplete(user) && location !== '/complete-profile') {
                navigate('/complete-profile');
            } else if (user?.status === 'pending' && location !== '/pending-approval') {
                // Redirect pending users to pending approval page
                navigate('/pending-approval');
            }
        }
    }, [isAuthenticated, loading, user, navigate, location]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // If incomplete profile, only allow access to complete-profile page
    if (isAuthenticated && isProfileIncomplete(user)) {
        return null;
    }

    // If pending, only allow access to pending-approval page
    if (isAuthenticated && user?.status === 'pending') {
        return null;
    }

    return isAuthenticated ? children : null;
}

export default AuthContext;
