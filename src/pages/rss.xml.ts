import rss from '@astrojs/rss';
import { db } from '../db';
import { news } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
    const publishedNews = await db.select()
        .from(news)
        .where(eq(news.published, true))
        .orderBy(desc(news.createdAt))
        .limit(20);

    return rss({
        title: 'Inox Link | Notícias e Conhecimento sobre Aço Inox',
        description: 'O principal portal brasileiro de notícias e conhecimento técnico sobre o mundo do aço inoxidável.',
        site: context.site || 'https://inoxlink.com.br',
        items: publishedNews.map((item) => ({
            title: item.title,
            pubDate: new Date(item.createdAt || new Date()),
            description: item.excerpt || '',
            link: `/noticias/${item.slug}/`,
        })),
        customData: `<language>pt-br</language>`,
    });
};
