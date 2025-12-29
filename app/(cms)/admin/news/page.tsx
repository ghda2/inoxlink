import { db } from "@/lib/db";
import { NewsListClient } from "@/components/admin/NewsListClient";

export default async function NewsListPage() {
    const result = await db.query(`
    SELECT n.*, c.name as category_name 
    FROM news n 
    LEFT JOIN categories c ON n.category_id = c.id 
    ORDER BY n.created_at DESC
  `);
    const news = result.rows;

    return <NewsListClient news={news} />;
}
