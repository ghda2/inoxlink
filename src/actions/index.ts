import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { db } from '../db';
import { news, wiki, categories } from '../db/schema';
import { eq } from 'drizzle-orm';

export const server = {
    createNews: defineAction({
        accept: 'json',
        input: z.object({
            title: z.string(),
            slug: z.string(),
            content: z.string(),
            excerpt: z.string().optional(),
            imageUrl: z.string().optional(),
            categoryId: z.number().optional(),
            authorId: z.number().optional(),
            published: z.boolean().default(false),
        }),
        handler: async (input) => {
            try {
                const result = await db.insert(news).values({
                    ...input,
                    updatedAt: new Date().toISOString(),
                }).returning();
                return { success: true, data: result[0] };
            } catch (error) {
                console.error('Error creating news:', error);
                return { success: false, error: 'Falha ao criar matéria' };
            }
        },
    }),

    updateNews: defineAction({
        accept: 'json',
        input: z.object({
            id: z.number().optional(), // Tornar id opcional para facilitar a chamada condicional no front
            title: z.string(),
            slug: z.string(),
            content: z.string(),
            excerpt: z.string().optional(),
            imageUrl: z.string().optional(),
            categoryId: z.number().optional(),
            authorId: z.number().optional(),
            published: z.boolean(),
        }),
        handler: async (input) => {
            const { id, ...data } = input;
            if (!id) return { success: false, error: 'ID necessário para atualização' };
            try {
                const result = await db.update(news)
                    .set({ ...data, updatedAt: new Date().toISOString() })
                    .where(eq(news.id, id))
                    .returning();
                return { success: true, data: result[0] };
            } catch (error) {
                console.error('Error updating news:', error);
                return { success: false, error: 'Falha ao atualizar matéria' };
            }
        },
    }),

    deleteNews: defineAction({
        accept: 'json',
        input: z.object({ id: z.number() }),
        handler: async ({ id }) => {
            try {
                await db.delete(news).where(eq(news.id, id));
                return { success: true };
            } catch (error) {
                console.error('Error deleting news:', error);
                return { success: false, error: 'Falha ao excluir matéria' };
            }
        },
    }),
    // Wiki
    createWiki: defineAction({
        accept: 'json',
        input: z.object({
            title: z.string(),
            slug: z.string(),
            content: z.string(),
            authorId: z.number().optional(),
        }),
        handler: async (input) => {
            try {
                const result = await db.insert(wiki).values({
                    ...input,
                    updatedAt: new Date().toISOString(),
                }).returning();
                return { success: true, data: result[0] };
            } catch (error) {
                console.error('Error creating wiki:', error);
                return { success: false, error: 'Falha ao criar artigo' };
            }
        },
    }),

    // Categories
    createCategory: defineAction({
        accept: 'json',
        input: z.object({
            name: z.string(),
            slug: z.string(),
            description: z.string().optional(),
        }),
        handler: async (input) => {
            try {
                const result = await db.insert(categories).values(input).returning();
                return { success: true, data: result[0] };
            } catch (error) {
                return { success: false, error: 'Falha ao criar categoria' };
            }
        },
    }),

    deleteCategory: defineAction({
        accept: 'json',
        input: z.object({ id: z.number() }),
        handler: async ({ id }) => {
            try {
                await db.delete(categories).where(eq(categories.id, id));
                return { success: true };
            } catch (error) {
                return { success: false, error: 'Não é possível excluir categorias em uso.' };
            }
        },
    }),
};
