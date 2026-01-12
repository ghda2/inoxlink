import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

async function runSQL() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error('❌ DATABASE_URL not found');
        return;
    }

    const sql = neon(databaseUrl);
    const sqlFilePath = path.join(process.cwd(), 'src', 'scripts', 'rebuild.sql');

    console.log('⏳ Reading rebuild.sql...');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Split by semicolon but ignore semicolons inside quotes or comments if they exist
    // A simpler way with Neon is to run the whole block if possible, but standard neon-http might prefer individual statements or a single block.
    // Actually, Neon's `sql` tagged template or the `neon()` function can execute multiple statements if they are separated by `;`.

    console.log('🚀 Executing SQL...');

    try {
        // For many statements, it's often safer to run them one by one or as a script
        // But Neon's HTTP client often supports multi-statement queries in one go.
        await sql.query(sqlContent);
        console.log('✅ Database rebuilt successfully!');
    } catch (error) {
        console.error('❌ Error executing SQL:', error);

        // If it fails, try splitting by statement-breakpoint style (if we used it) or just split by semicolon
        console.log('🔄 Attempting to run statements individually...');
        const statements = sqlContent
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            try {
                await sql.query(statement + ';');
            } catch (innerError) {
                console.error(`❌ Failed statement: ${statement.substring(0, 50)}...`);
                console.error(innerError);
            }
        }
    }
}

runSQL();
