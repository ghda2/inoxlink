import { getCategories, getNewsBySlug, updateNews } from "@/lib/actions/news";
import { getAuthors } from "@/lib/actions/authors";
import { NewsForm } from "@/components/admin/NewsForm";
import { notFound } from "next/navigation";

export default async function EditNewsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [categories, authors, newsData] = await Promise.all([
        getCategories(),
        getAuthors(),
        getNewsBySlug(slug)
    ]);

    if (!newsData) return notFound();

    const handleUpdate = async (values: any) => {
        "use server";
        await updateNews(newsData.id, values);
    };

    return <NewsForm initialData={newsData} categories={categories} authors={authors} onSubmit={handleUpdate} isEdit={true} />;
}
