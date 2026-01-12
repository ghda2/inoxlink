import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { news } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ params }) => {
    const id = parseInt(params.id!);
    const [item] = await db.select().from(news).where(eq(news.id, id));

    if (!item) return new Response(null, { status: 404 });
    return new Response(JSON.stringify(item), { status: 200 });
};

export const PATCH: APIRoute = async ({ params, request }) => {
    const id = parseInt(params.id!);
    const body = await request.json();

    const result = await db.update(news)
        .set({ ...body, updatedAt: new Date().toISOString() })
        .where(eq(news.id, id))
        .returning();

    return new Response(JSON.stringify(result[0]), { status: 200 });
};

export const DELETE: APIRoute = async ({ params }) => {
    const id = parseInt(params.id!);
    await db.delete(news).where(eq(news.id, id));
    return new Response(null, { status: 204 });
};
