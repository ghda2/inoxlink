import type { APIRoute } from 'astro';
import { db } from '../db';
import { news, wiki, categories } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export const prerender = false;

export const GET: APIRoute = async () => {
    const baseUrl = 'https://inoxlink.com.br';

    // Fetch news
    const newsItems = await db
        .select({
            slug: news.slug,
            title: news.title,
            imageUrl: news.imageUrl,
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
            title: wiki.title,
            imageUrl: wiki.imageUrl,
            updatedAt: wiki.updatedAt,
            createdAt: wiki.createdAt,
        })
        .from(wiki)
        .orderBy(desc(wiki.createdAt));

    const staticPages = [
        '',
        '/noticias',
        '/wiki',
        '/contato',
        '/privacidade',
        '/termos',
    ];

    const categoryList = await db.select().from(categories);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
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
        ${item.imageUrl ? `
        <image:image>
            <image:loc>${item.imageUrl.startsWith('http') ? item.imageUrl : baseUrl + item.imageUrl}</image:loc>
            <image:title><![CDATA[${item.title}]]></image:title>
        </image:image>` : ''}
    </url>`).join('')}
    ${wikiItems.map(item => `
    <url>
        <loc>${baseUrl}/wiki/${item.slug}</loc>
        <lastmod>${new Date(item.updatedAt || item.createdAt || new Date()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
        ${item.imageUrl ? `
        <image:image>
            <image:loc>${item.imageUrl.startsWith('http') ? item.imageUrl : baseUrl + item.imageUrl}</image:loc>
            <image:title><![CDATA[${item.title}]]></image:title>
        </image:image>` : ''}
    </url>`).join('')}
    ${categoryList.map(cat => `
    <url>
        <loc>${baseUrl}/noticias?categoria=${cat.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/wiki?categoria=${cat.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
    </url>`).join('')}
</urlset>`.trim();

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'X-Content-Type-Options': 'nosniff',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
};
