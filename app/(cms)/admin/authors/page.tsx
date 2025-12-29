import { db } from "@/lib/db";
import { AdminListClient } from "@/components/admin/AdminListClient";
import { deleteAuthor } from "@/lib/actions/authors";

export default async function AuthorsPage() {
    const authors = (await db.query("SELECT * FROM authors ORDER BY name ASC")).rows;
    return (
        <AdminListClient
            title="Autores"
            items={authors}
            createLink="/admin/authors/create"
            columns={[{ label: "Nome", key: "name" }, { label: "Slug", key: "slug" }]}
            editUrlPrefix="/admin/authors/edit"
            deleteAction={deleteAuthor}
        />
    );
}
