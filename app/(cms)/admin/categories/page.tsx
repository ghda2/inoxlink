import { db } from "@/lib/db";
import { AdminListClient } from "@/components/admin/AdminListClient";
import { deleteCategory } from "@/lib/actions/categories";

export default async function CategoriesPage() {
    const categories = (await db.query("SELECT * FROM categories ORDER BY name ASC")).rows;
    return (
        <AdminListClient
            title="Categorias"
            items={categories}
            createLink="/admin/categories/create"
            columns={[{ label: "Nome", key: "name" }, { label: "Slug", key: "slug" }]}
            editUrlPrefix="/admin/categories/edit"
            deleteAction={deleteCategory}
        />
    );
}
