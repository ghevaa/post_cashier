import { defineConfig } from 'drizzle-kit';

// Workaround for Supabase SSL certificate issues with Drizzle Kit
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default defineConfig({
    schema: './src/db/schema/index.ts',
    out: './src/db/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    verbose: true,
    strict: true,
});
