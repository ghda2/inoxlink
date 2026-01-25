import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function applyMigration() {
    try {
        await sql`ALTER TABLE "wiki" ADD COLUMN IF NOT EXISTS "image_url" varchar(500)`;
        await sql`ALTER TABLE "wiki" ADD COLUMN IF NOT EXISTS "category_id" integer`;
        await sql`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'wiki_category_id_fkey'
                ) THEN
                    ALTER TABLE "wiki" ADD CONSTRAINT "wiki_category_id_fkey" 
                    FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
                END IF;
            END $$;
        `;
        console.log('Migrate success!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

applyMigration();
