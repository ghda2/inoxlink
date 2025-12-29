import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch news with author and category
    const result = await db.query(`
    SELECT n.*, c.name as category_name, c.slug as category_slug, a.name as author_name, a.bio as author_bio
    FROM news n 
    LEFT JOIN categories c ON n.category_id = c.id 
    LEFT JOIN authors a ON n.author_id = a.id
    WHERE n.slug = $1 AND n.published = true
  `, [slug]);

    const item = result.rows[0];

    if (!item) {
        notFound();
    }

    const publishedAt = item.published_at ? new Date(item.published_at) : new Date(item.created_at);

    return (
        <article className="pb-16 md:pb-24 pt-24 md:pt-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Main Content Area */}
                    <div className="lg:w-2/3">
                        {/* Minimal Header */}
                        <div className="space-y-6 mb-8 md:mb-12">
                            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-black transition-colors group">
                                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Voltar ao Início
                            </Link>

                            <div className="space-y-4">
                                <Badge variant="outline" className="border-slate-200 text-slate-500 font-bold uppercase tracking-tighter text-[10px] px-3">
                                    {item.category_name}
                                </Badge>
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-950 leading-tight tracking-tighter">
                                    {item.title}
                                </h1>
                                <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed border-l-4 border-slate-900 pl-6 py-1">
                                    {item.excerpt || "Análise e cobertura completa sobre as movimentações do mercado e avanços tecnológicos."}
                                </p>
                            </div>

                            {item.image_url && (
                                <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-slate-100 shadow-2xl">
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-6 text-slate-400 pt-6 border-b border-slate-100 pb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-900 border border-slate-200">
                                        {item.author_name?.charAt(0) || "R"}
                                    </div>
                                    <span className="text-slate-900 font-bold text-sm">{item.author_name || "Redação Inox Link"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                    <Calendar className="h-4 w-4" />
                                    <span>{format(publishedAt, "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                    <Clock className="h-4 w-4" />
                                    <span>{Math.ceil(item.content.length / 1000) + 2} min leitura</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="prose prose-slate prose-lg md:prose-xl max-w-none 
                  prose-headings:text-slate-950 prose-headings:font-black prose-headings:tracking-tighter
                  prose-p:text-slate-700 prose-p:leading-relaxed
                  prose-strong:text-slate-950 prose-strong:font-black
                  prose-a:text-black prose-a:font-bold prose-a:underline decoration-slate-300 underline-offset-4 hover:decoration-black transition-all
                  prose-img:rounded-3xl prose-img:border prose-img:border-slate-100
                  ">
                            <div dangerouslySetInnerHTML={{ __html: item.content }} />

                            {/* Sharing */}
                            <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Compartilhar:</span>
                                    <Button variant="outline" size="icon" className="rounded-xl hover:bg-black hover:text-white border-slate-200 transition-all"><Share2 className="h-4 w-4" /></Button>
                                </div>
                                <Link href={`/category/${item.category_slug}`}>
                                    <Button variant="ghost" className="text-black font-black uppercase text-xs tracking-widest hover:bg-slate-50">
                                        Ver mais em {item.category_name} <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Author Box */}
                        <div className="mt-12 bg-slate-50 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center border border-slate-100">
                            <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shrink-0 flex items-center justify-center text-slate-950 font-black text-3xl shadow-sm">
                                {item.author_name?.charAt(0) || "R"}
                            </div>
                            <div className="text-center md:text-left space-y-2">
                                <h4 className="text-xl font-black text-slate-950">{item.author_name || "Redação Inox Link"}</h4>
                                <p className="text-slate-600 leading-relaxed font-medium text-sm">
                                    {item.author_bio || "Especialista técnico focado em trazer a informação mais precisa e atualizada para os leitores do Inox Link."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-1/3">
                        <div className="sticky top-32 space-y-12">
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 pb-4">Artigos Relacionados</h3>
                                <div className="space-y-6">
                                    <div className="group cursor-pointer space-y-2">
                                        <h4 className="font-bold text-slate-900 group-hover:text-black transition-colors leading-snug">
                                            As novas regulamentações que impactam o setor de aço em 2026
                                        </h4>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3 min de leitura</span>
                                    </div>
                                    <div className="group cursor-pointer space-y-2">
                                        <h4 className="font-bold text-slate-900 group-hover:text-black transition-colors leading-snug">
                                            Tendências de cores e texturas para superfícies de inox
                                        </h4>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">5 min de leitura</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-950 p-8 rounded-3xl text-white space-y-4 border border-slate-900 shadow-2xl">
                                <h3 className="text-xl font-black tracking-tighter">Fique por dentro</h3>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                    Receba análises exclusivas do setor de inox diretamente no seu e-mail.
                                </p>
                                <Button className="w-full bg-white text-black hover:bg-slate-200 font-black uppercase text-xs tracking-widest py-6 rounded-xl">Assinar</Button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </article>
    );
}
