"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createWiki(values: any) {
    const { title, slug, content, author_id, meta_title, meta_description } = values;
    try {
        await db.query(
            `INSERT INTO wiki (title, slug, content, author_id, meta_title, meta_description, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [title, slug, content, author_id ? parseInt(author_id) : null, meta_title, meta_description]
        );
        revalidatePath("/admin/wiki");
    } catch (error: any) {
        return { error: error.message };
    }
    redirect("/admin/wiki");
}

export async function updateWiki(id: number, values: any) {
    const { title, slug, content, author_id, meta_title, meta_description } = values;
    try {
        await db.query(
            `UPDATE wiki SET title = $1, slug = $2, content = $3, author_id = $4, 
       meta_title = $5, meta_description = $6, updated_at = NOW() WHERE id = $7`,
            [title, slug, content, author_id ? parseInt(author_id) : null, meta_title, meta_description, id]
        );
        revalidatePath("/admin/wiki");
    } catch (error: any) {
        return { error: error.message };
    }
    redirect("/admin/wiki");
}

export async function deleteWiki(id: number) {
    try {
        await db.query("DELETE FROM wiki WHERE id = $1", [id]);
        revalidatePath("/admin/wiki");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getWikiBySlug(slug: string) {
    const result = await db.query("SELECT * FROM wiki WHERE slug = $1", [slug]);
    return result.rows[0];
}
