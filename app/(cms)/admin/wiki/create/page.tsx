import { getAuthors } from "@/lib/actions/authors";
import { WikiForm } from "@/components/admin/WikiForm";
import { createWiki } from "@/lib/actions/wiki";

export default async function CreateWiki() {
    const authors = await getAuthors();
    return <WikiForm authors={authors} onSubmit={createWiki} />;
}
