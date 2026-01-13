import type { APIRoute } from 'astro';

const robots = `
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://inoxlink.com.br/sitemap.xml
`.trim();

export const GET: APIRoute = () => {
    return new Response(robots, {
        headers: { 'Content-Type': 'text/plain' },
    });
};
