import { createAuthor } from "@/lib/actions/authors";
import { AuthorForm } from "@/components/admin/AuthorForm";

export default function CreateAuthor() {
    return <AuthorForm onSubmit={createAuthor} />;
}
