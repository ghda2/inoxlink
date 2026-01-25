import type { APIRoute } from 'astro';
import { db } from '../../../../db';
import { categories } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ params, redirect }) => {
    const { id } = params;

    if (!id) {
        return redirect('/admin/categories?error=missing_id');
    }

    try {
        await db.delete(categories).where(eq(categories.id, parseInt(id)));
        return redirect('/admin/categories?success=deleted');
    } catch (error) {
        console.error('Error deleting category:', error);
        return redirect('/admin/categories?error=delete_failed');
    }
};
