import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as relations from './relations';

const databaseUrl = process.env?.DATABASE_URL || import.meta.env?.DATABASE_URL;

if (!databaseUrl) {
    console.warn('⚠️ DATABASE_URL não encontrada no ambiente.');
}

// Inicializa com string vazia apenas se não houver URL, 
// mas embrulha para evitar erro imediato no build se não for usado.
const sql = neon(databaseUrl || 'postgresql://placeholder:placeholder@localhost:5432/placeholder');
export const db = drizzle(sql, {
    schema: { ...schema, ...relations }
});
