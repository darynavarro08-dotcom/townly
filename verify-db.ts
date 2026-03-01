import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { db } from './src/db';
import { sql } from 'drizzle-orm';

async function verify() {
    try {
        console.log('Checking tables...');
        const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        // Drizzle's execute with postgres-js returns the rows directly
        const tableNames = (tables as any).map((r: any) => r.table_name);
        console.log('Tables:', tableNames.join(', '));

        if (tableNames.includes('community_members')) {
            console.log('\nChecking "community_members" columns...');
            const cols = await db.execute(sql`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'community_members'
        `);
            console.table(cols);
        } else {
            console.log('\n"community_members" table NOT FOUND!');
        }

    } catch (e: any) {
        console.error('Verification failed:', e.message);
        if (e.stack) console.error(e.stack);
    } finally {
        process.exit(0);
    }
}

verify();
