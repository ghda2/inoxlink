import { getWikiBySlug, updateWiki } from "@/lib/actions/wiki";
import { getAuthors } from "@/lib/actions/authors";
import { WikiForm } from "@/components/admin/WikiForm";
import { notFound } from "next/navigation";

export default async function EditWiki({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [wiki, authors] = await Promise.all([getWikiBySlug(slug), getAuthors()]);
    if (!wiki) return notFound();

    const handleUpdate = async (v: any) => { "use server"; await updateWiki(wiki.id, v); };
    return <WikiForm initialData={wiki} authors={authors} isEdit={true} onSubmit={handleUpdate} />;
}
