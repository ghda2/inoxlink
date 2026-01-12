import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { news } from '../../../db/schema';
import { desc } from 'drizzle-orm';

export const GET: APIRoute = async () => {
    try {
        const allNews = await db.select().from(news).orderBy(desc(news.createdAt));
        return new Response(JSON.stringify(allNews), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Erro ao buscar notícias' }), { status: 500 });
    }
};

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const result = await db.insert(news).values({
            ...body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }).returning();

        return new Response(JSON.stringify(result[0]), { status: 201 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
