import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
    try {
        await pool.query('ALTER TABLE community_members ADD COLUMN IF NOT EXISTS dues_paid BOOLEAN NOT NULL DEFAULT false');
        console.log('✅ dues_paid column added (or already exists)');
    } catch (err: any) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
