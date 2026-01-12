import type { APIRoute } from 'astro';
import { db } from '../../db';
import { news, wiki, authors } from '../../db/schema';
import { sql } from 'drizzle-orm';

export const GET: APIRoute = async () => {
    try {
        const [newsCount] = await db.select({ count: sql<number>`count(*)` }).from(news);
        const [wikiCount] = await db.select({ count: sql<number>`count(*)` }).from(wiki);
        const [authorsCount] = await db.select({ count: sql<number>`count(*)` }).from(authors);

        return new Response(JSON.stringify({
            news: newsCount.count,
            wiki: wikiCount.count,
            authors: authorsCount.count,
            views: '12.4k' // Placeholder por enquanto
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Erro ao buscar estatísticas' }), { status: 500 });
    }
};
