import { createCategory } from "@/lib/actions/categories";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function CreateCategory() {
    return <CategoryForm onSubmit={createCategory} />;
}
