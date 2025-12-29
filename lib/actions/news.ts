"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createNews(values: any) {
    const { title, slug, content, excerpt, image_url, category_id, author_id, meta_title, meta_description } = values;
    try {
        await db.query(
            `INSERT INTO news (title, slug, content, excerpt, image_url, category_id, author_id, meta_title, meta_description, published, published_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, NOW())`,
            [title, slug, content, excerpt, image_url, parseInt(category_id), author_id ? parseInt(author_id) : null, meta_title, meta_description]
        );
        revalidatePath("/admin/news");
        revalidatePath("/");
    } catch (error: any) {
        return { error: error.message };
    }
    redirect("/admin/news");
}

export async function updateNews(id: number, values: any) {
    const { title, slug, content, excerpt, image_url, category_id, author_id, meta_title, meta_description } = values;
    try {
        await db.query(
            `UPDATE news SET title = $1, slug = $2, content = $3, excerpt = $4, image_url = $5, category_id = $6, author_id = $7, 
       meta_title = $8, meta_description = $9, updated_at = NOW() WHERE id = $10`,
            [title, slug, content, excerpt, image_url, parseInt(category_id), author_id ? parseInt(author_id) : null, meta_title, meta_description, id]
        );
        revalidatePath("/admin/news");
        revalidatePath("/");
    } catch (error: any) {
        return { error: error.message };
    }
    redirect("/admin/news");
}

export async function deleteNews(id: number) {
    try {
        await db.query("DELETE FROM news WHERE id = $1", [id]);
        revalidatePath("/admin/news");
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getNewsBySlug(slug: string) {
    const result = await db.query("SELECT * FROM news WHERE slug = $1", [slug]);
    return result.rows[0];
}

export async function getCategories() {
    const result = await db.query("SELECT * FROM categories ORDER BY name ASC");
    return result.rows;
}
