import { db } from '../db';
import { news, categories, authors, wiki } from '../db/schema';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
    console.log('🌱 Começando o seeding...');

    try {
        // 1. Criar Categoria
        const [category] = await db.insert(categories).values({
            name: 'Arquitetura',
            slug: 'arquitetura',
            description: 'Notícias sobre o uso de inox na arquitetura.',
        }).returning();

        // 2. Criar Autor
        const [author] = await db.insert(authors).values({
            name: 'Gabriel Santos',
            slug: 'gabriel-santos',
            bio: 'Especialista em ligas metálicas e portal Inox Link.',
        }).returning();

        // 3. Criar Notícias
        await db.insert(news).values([
            {
                title: 'Lançamento da nova liga AISI 316L High-Chrome',
                slug: 'lancamento-nova-liga-316l-high-chrome',
                content: '<p>A nova liga promete resistência superior em ambientes marítimos extremos...</p>',
                excerpt: 'Nova liga de inox promete revolucionar o mercado naval.',
                categoryId: category.id,
                authorId: author.id,
                published: true,
                createdAt: new Date().toISOString(),
            },
            {
                title: 'Tendências de Inox na Decoração de Interiores 2024',
                slug: 'tendencias-inox-decoracao-2024',
                content: '<p>O acabamento escovado continua sendo o preferido dos designers...</p>',
                excerpt: 'Saiba o que está em alta no mercado de luxo.',
                categoryId: category.id,
                authorId: author.id,
                published: true,
                createdAt: new Date().toISOString(),
            }
        ]);

        // 4. Criar Wiki
        await db.insert(wiki).values([
            {
                title: 'O Futuro do Aço Inoxidável na Arquitetura Moderna',
                slug: 'futuro-aco-inox',
                content: '<p>O aço inoxidável está se tornando o material de escolha para arquitetos que buscam durabilidade e estética sustentável...</p>',
                authorId: author.id,
                createdAt: new Date().toISOString(),
            },
            {
                title: 'Guia de Ligas: AISI 304 vs 316',
                slug: 'guia-ligas-304-316',
                content: '<p>A principal diferença entre o inox 304 e o 316 é a presença de molibdênio...</p>',
                authorId: author.id,
                createdAt: new Date().toISOString(),
            }
        ]);

        console.log('✅ Seeding concluído com sucesso!');
    } catch (error) {
        console.error('❌ Erro no seeding:', error);
    }
}

seed();
