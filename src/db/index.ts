import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as relations from './relations';

const databaseUrl = import.meta.env?.DATABASE_URL || process.env?.DATABASE_URL;

if (!databaseUrl) {
    console.warn('⚠️ DATABASE_URL não encontrada! Verifique o arquivo .env');
}

const sql = neon(databaseUrl!);
export const db = drizzle(sql, {
    schema: { ...schema, ...relations }
});
