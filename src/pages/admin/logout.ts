import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ session, redirect }) => {
    if (session) {
        await session.destroy();
    }
    return redirect('/admin/login');
};
