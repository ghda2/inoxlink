import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { authors } from '../../../db/schema';

export const GET: APIRoute = async () => {
    try {
        const allAuthors = await db.select().from(authors);
        return new Response(JSON.stringify(allAuthors), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Erro ao buscar autores' }), { status: 500 });
    }
};
