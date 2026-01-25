import rss from '@astrojs/rss';
import { db } from '../db';
import { news } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export const prerender = false;

export async function GET(context) {
    const newsItems = await db
        .select({
            title: news.title,
            slug: news.slug,
            excerpt: news.excerpt,
            createdAt: news.createdAt,
        })
        .from(news)
        .where(eq(news.published, true))
        .orderBy(desc(news.createdAt))
        .limit(50);

    return rss({
        title: 'Inox Link - Notícias',
        description: 'Fique por dentro das últimas novidades do mundo do aço inox.',
        site: context.site || 'https://inoxlink.com.br',
        items: newsItems.map((item) => ({
            title: item.title,
            pubDate: item.createdAt,
            description: item.excerpt,
            link: `/noticias/${item.slug}`,
        })),
        customData: `<language>pt-br</language>`,
    });
}
