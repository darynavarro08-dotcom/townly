const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function check() {
    try {
        console.log('Running failing query...');
        // Exact columns from error message
        const result = await sql`
      select "id", "user_id", "community_id", "role", "dues_paid", "joined_at" 
      from "community_members" 
      where "community_members"."user_id" = 16
    `;
        console.log('Success!', result.length, 'rows found.');
        console.log(result);
    } catch (err) {
        console.error('FAILED!');
        console.error('Message:', err.message);
        console.error('Code:', err.code);
        console.error('Detail:', err.detail);
        console.error('Hint:', err.hint);
        console.error('Table:', err.table);
    } finally {
        process.exit(0);
    }
}

check();
