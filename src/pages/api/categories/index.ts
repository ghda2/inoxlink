import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { categories } from '../../../db/schema';

export const GET: APIRoute = async () => {
    try {
        const allCategories = await db.select().from(categories);
        return new Response(JSON.stringify(allCategories), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Erro ao buscar categorias' }), { status: 500 });
    }
};
