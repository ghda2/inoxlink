import { getCategoryBySlug, updateCategory } from "@/lib/actions/categories";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { notFound } from "next/navigation";

export default async function EditCategory({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);
    if (!category) return notFound();

    const handleUpdate = async (v: any) => { "use server"; await updateCategory(category.id, v); };
    return <CategoryForm initialData={category} isEdit={true} onSubmit={handleUpdate} />;
}
