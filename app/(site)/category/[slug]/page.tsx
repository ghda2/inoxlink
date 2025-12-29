import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/site/NewsCard";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch category details
    const catResult = await db.query("SELECT * FROM categories WHERE slug = $1", [slug]);
    const category = catResult.rows[0];

    if (!category) {
        notFound();
    }

    // Fetch news for this category
    const newsResult = await db.query(`
    SELECT n.*, c.name as category_name, a.name as author_name 
    FROM news n 
    LEFT JOIN categories c ON n.category_id = c.id 
    LEFT JOIN authors a ON n.author_id = a.id
    WHERE c.slug = $1 AND n.published = true
    ORDER BY n.published_at DESC
  `, [slug]);
    const news = newsResult.rows;

    return (
        <div className="pb-24">
            {/* Category Header */}
            <section className="pt-40 pb-20 bg-white border-b border-slate-100">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl space-y-8">
                        <Badge className="bg-black text-white hover:bg-black border-none px-5 py-1.5 text-xs font-black uppercase tracking-tighter">
                            Arquivo da Categoria
                        </Badge>
                        <h1 className="text-5xl md:text-8xl font-black text-slate-950 leading-none tracking-tighter">
                            {category.name}
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed">
                            {category.description || `Explora as últimas notícias, tendências e atualizações técnicas em ${category.name}.`}
                        </p>
                        <div className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] pt-4">
                            <Layers className="h-4 w-4 text-black" />
                            {news.length} {news.length === 1 ? 'Matéria Publicada' : 'Matérias Publicadas'}
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid of Results */}
            <section className="container mx-auto px-4 md:px-6 pt-16">
                {news.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
                        {news.map((item) => (
                            <NewsCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-xl font-medium">Nenhuma notícia encontrada nesta categoria.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
