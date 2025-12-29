import { db } from "@/lib/db";
import { AdminListClient } from "@/components/admin/AdminListClient";
import { deleteWiki } from "@/lib/actions/wiki";

export default async function WikiPage() {
    const wiki = (await db.query(`
    SELECT w.*, a.name as author_name 
    FROM wiki w 
    LEFT JOIN authors a ON w.author_id = a.id 
    ORDER BY w.title ASC
  `)).rows;

    return (
        <AdminListClient
            title="Wiki"
            items={wiki}
            createLink="/admin/wiki/create"
            columns={[
                { label: "Título", key: "title" },
                { label: "Slug", key: "slug" },
                { label: "Autor", key: "author_name" }
            ]}
            editUrlPrefix="/admin/wiki/edit"
            deleteAction={deleteWiki}
        />
    );
}
