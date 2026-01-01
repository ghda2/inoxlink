import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as relations from './relations';

const databaseUrl = process.env?.DATABASE_URL || import.meta.env?.DATABASE_URL;

if (!databaseUrl) {
    console.error('❌ ERRO CRÍTICO: DATABASE_URL não encontrada no ambiente!');
    if (import.meta.env.PROD) {
        // Em produção, vamos apenas logar e deixar o erro estourar ao tentar conectar
        console.error('Certifique-se de que a variável DATABASE_URL está definida no PM2 ou no arquivo .env');
    }
}

const sql = neon(databaseUrl || '');
export const db = drizzle(sql, {
    schema: { ...schema, ...relations }
});
