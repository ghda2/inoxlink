import type { APIRoute } from 'astro';
import { db } from '../db';
import { news, wiki } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export const GET: APIRoute = async () => {
    const baseUrl = 'https://inoxlink.com.br';

    // Fetch news
    const newsItems = await db
        .select({
            slug: news.slug,
            updatedAt: news.updatedAt,
            createdAt: news.createdAt,
            published: news.published,
        })
        .from(news)
        .where(eq(news.published, true))
        .orderBy(desc(news.createdAt));

    // Fetch wiki items
    const wikiItems = await db
        .select({
            slug: wiki.slug,
            updatedAt: wiki.updatedAt,
            createdAt: wiki.createdAt,
        })
        .from(wiki)
        .orderBy(desc(wiki.createdAt));

    const staticPages = [
        '',
        '/noticias',
        '/wiki',
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages.map(page => `
    <url>
        <loc>${baseUrl}${page}</loc>
        <changefreq>daily</changefreq>
        <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>`).join('')}
    ${newsItems.map(item => `
    <url>
        <loc>${baseUrl}/noticias/${item.slug}</loc>
        <lastmod>${new Date(item.updatedAt || item.createdAt || new Date()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`).join('')}
    ${wikiItems.map(item => `
    <url>
        <loc>${baseUrl}/wiki/${item.slug}</loc>
        <lastmod>${new Date(item.updatedAt || item.createdAt || new Date()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>`).join('')}
</urlset>`.trim();

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
};
