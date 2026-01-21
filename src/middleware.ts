import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ url, session, redirect }, next) => {
    const isProtected = url.pathname.startsWith('/admin') && url.pathname !== '/admin/login';

    if (isProtected) {
        const user = await session?.get('user');
        if (!user) {
            return redirect('/admin/login');
        }
    }

    return next();
});
