"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAuthor(values: any) {
    const { name, slug, bio, avatar_url } = values;
    try {
        await db.query(
            "INSERT INTO authors (name, slug, bio, avatar_url) VALUES ($1, $2, $3, $4)",
            [name, slug, bio, avatar_url]
        );
        revalidatePath("/admin/authors");
    } catch (error: any) {
        return { error: error.message };
    }
    redirect("/admin/authors");
}

export async function updateAuthor(id: number, values: any) {
    const { name, slug, bio, avatar_url } = values;
    try {
        await db.query(
            "UPDATE authors SET name = $1, slug = $2, bio = $3, avatar_url = $4 WHERE id = $5",
            [name, slug, bio, avatar_url, id]
        );
        revalidatePath("/admin/authors");
    } catch (error: any) {
        return { error: error.message };
    }
    redirect("/admin/authors");
}

export async function deleteAuthor(id: number) {
    try {
        await db.query("DELETE FROM authors WHERE id = $1", [id]);
        revalidatePath("/admin/authors");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getAuthorBySlug(slug: string) {
    const result = await db.query("SELECT * FROM authors WHERE slug = $1", [slug]);
    return result.rows[0];
}

export async function getAuthors() {
    const result = await db.query("SELECT * FROM authors ORDER BY name ASC");
    return result.rows;
}
