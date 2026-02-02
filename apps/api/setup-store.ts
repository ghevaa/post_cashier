import 'dotenv/config';
import { db, pool } from './src/config/db';
import { stores, users, sessions } from './src/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

async function fullSetup() {
    console.log('=== FULL STORE SETUP ===\n');

    try {
        // Step 1: Check/Create Store
        console.log('1. Checking stores...');
        const existingStores = await db.select().from(stores);

        let storeId: string;
        if (existingStores.length === 0) {
            storeId = uuidv4();
            await db.insert(stores).values({
                id: storeId,
                name: 'My Store',
                currency: 'IDR',
                timezone: 'Asia/Jakarta',
            });
            console.log(`   Created new store: My Store (ID: ${storeId})`);
        } else {
            storeId = existingStores[0].id;
            console.log(`   Using existing store: ${existingStores[0].name} (ID: ${storeId})`);
        }

        // Step 2: Update all users with storeId
        console.log('\n2. Updating users with storeId...');
        const allUsers = await db.select().from(users);

        for (const user of allUsers) {
            await db.update(users)
                .set({ storeId: storeId })
                .where(eq(users.id, user.id));
            console.log(`   Updated: ${user.email} -> storeId: ${storeId}`);
        }

        // Step 3: IMPORTANT - Clear all sessions to force re-login
        console.log('\n3. Clearing all sessions (forces users to re-login)...');
        await db.delete(sessions);
        console.log('   All sessions cleared');

        // Step 4: Verify
        console.log('\n4. Verification:');
        const updatedUsers = await db.select().from(users);
        console.log('   Users:');
        for (const user of updatedUsers) {
            console.log(`   - ${user.email} | role: ${user.role} | storeId: ${user.storeId}`);
        }

        console.log('\n=== DONE ===');
        console.log('Please log in again to get a fresh session with the storeId.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

fullSetup();
