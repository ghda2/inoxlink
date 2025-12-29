import { getAuthorBySlug, updateAuthor } from "@/lib/actions/authors";
import { AuthorForm } from "@/components/admin/AuthorForm";
import { notFound } from "next/navigation";

export default async function EditAuthor({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const author = await getAuthorBySlug(slug);
    if (!author) return notFound();

    const handleUpdate = async (v: any) => { "use server"; await updateAuthor(author.id, v); };
    return <AuthorForm initialData={author} isEdit={true} onSubmit={handleUpdate} />;
}
