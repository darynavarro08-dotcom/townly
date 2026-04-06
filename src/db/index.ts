/**
 * Initializes the Drizzle ORM client with a Postgres connection string, exporting
 * the 'db' instance for application-wide database operations.
 */
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Check if DATABASE_URL is available
const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/townly';

// Next.js guarantees process.env is populated before any module code runs
// in the request lifecycle. We initialize once at module load time.
const connectionString = databaseUrl;

const client = postgres(connectionString, {
    max: 5,
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: 'require',
});

export const db = drizzle(client, { schema });
