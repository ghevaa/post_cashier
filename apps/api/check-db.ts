import 'dotenv/config';
import { db } from './src/config/db';
import { stores, users } from './src/db/schema';

async function checkDatabase() {
    console.log('=== DATABASE STATUS ===\n');

    const allStores = await db.select().from(stores);
    console.log('STORES:');
    console.table(allStores.map(s => ({ id: s.id, name: s.name })));

    const allUsers = await db.select().from(users);
    console.log('\nUSERS:');
    console.table(allUsers.map(u => ({
        id: u.id.substring(0, 10) + '...',
        email: u.email,
        role: u.role,
        storeId: u.storeId
    })));

    process.exit(0);
}

checkDatabase();
