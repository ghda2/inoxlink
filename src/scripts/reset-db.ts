import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

async function resetDatabase() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error('❌ DATABASE_URL not found');
        return;
    }

    const sql = neon(databaseUrl);

    console.log('⏳ Dropping all tables...');

    try {
        // Drop tables in order to respect foreign keys
        await sql`DROP TABLE IF EXISTS "wiki" CASCADE;`;
        await sql`DROP TABLE IF EXISTS "news" CASCADE;`;
        await sql`DROP TABLE IF EXISTS "authors" CASCADE;`;
        await sql`DROP TABLE IF EXISTS "categories" CASCADE;`;

        // Also drop drizzle migrations table if you want a complete fresh start
        await sql`DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE;`;

        console.log('✅ All tables dropped successfully!');
    } catch (error) {
        console.error('❌ Error dropping tables:', error);
    }
}

resetDatabase();
