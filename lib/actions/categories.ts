"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCategory(values: any) {
    const { name, slug, description } = values;
    try {
        await db.query(
            "INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3)",
            [name, slug, description]
        );
        revalidatePath("/admin/categories");
    } catch (error: any) {
        return { error: error.message };
    }
    redirect("/admin/categories");
}

export async function updateCategory(id: number, values: any) {
    const { name, slug, description } = values;
    try {
        await db.query(
            "UPDATE categories SET name = $1, slug = $2, description = $3 WHERE id = $4",
            [name, slug, description, id]
        );
        revalidatePath("/admin/categories");
    } catch (error: any) {
        return { error: error.message };
    }
    redirect("/admin/categories");
}

export async function deleteCategory(id: number) {
    try {
        await db.query("DELETE FROM categories WHERE id = $1", [id]);
        revalidatePath("/admin/categories");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getCategoryBySlug(slug: string) {
    const result = await db.query("SELECT * FROM categories WHERE slug = $1", [slug]);
    return result.rows[0];
}
