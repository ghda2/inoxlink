import { getCategories, createNews } from "@/lib/actions/news";
import { getAuthors } from "@/lib/actions/authors";
import { NewsForm } from "@/components/admin/NewsForm";

export default async function CreateNewsPage() {
    const [categories, authors] = await Promise.all([getCategories(), getAuthors()]);
    return <NewsForm categories={categories} authors={authors} onSubmit={createNews} />;
}
