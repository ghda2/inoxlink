import { db } from '../db';
import { news, categories, authors } from '../db/schema';
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

        console.log('✅ Seeding concluído com sucesso!');
    } catch (error) {
        console.error('❌ Erro no seeding:', error);
    }
}

seed();
