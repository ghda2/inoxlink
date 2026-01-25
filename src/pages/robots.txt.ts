import type { APIRoute } from 'astro';

const robots = `
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# Sitemap URLs
Sitemap: https://inoxlink.com.br/sitemap.xml
Sitemap: https://inoxlink.com.br/rss.xml

# Extra bot rules
User-agent: GPTBot
Disallow: /admin/

User-agent: CCBot
Disallow: /admin/
`.trim();

export const GET: APIRoute = () => {
    return new Response(robots, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
};
