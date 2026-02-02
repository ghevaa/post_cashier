import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002',
    basePath: '/api/v1/auth',
});

export const { signIn, signUp, signOut, useSession } = authClient;
