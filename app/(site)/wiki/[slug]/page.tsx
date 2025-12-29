import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Share2, ArrowLeft, Clock, History } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function WikiItemPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const result = await db.query(`
    SELECT w.*, a.name as author_name, a.bio as author_bio
    FROM wiki w 
    LEFT JOIN authors a ON w.author_id = a.id 
    WHERE w.slug = $1
  `, [slug]);

    const item = result.rows[0];

    if (!item) {
        notFound();
    }

    return (
        <article className="pb-24">
            {/* Header */}
            <header className="pt-32 pb-16 bg-slate-50 border-b border-slate-100">
                <div className="container mx-auto px-4 md:px-6">
                    <Link href="/wiki" className="inline-flex items-center gap-2 text-slate-500 font-medium hover:text-slate-900 transition-colors mb-8 group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Voltar para Wiki
                    </Link>

                    <div className="max-w-4xl space-y-7">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-slate-900 text-white hover:bg-black border-none px-4 py-1 font-black uppercase tracking-tighter text-[10px]">
                                Conteúdo Verificado
                            </Badge>
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <History className="h-3 w-3" /> Revisitado em {format(new Date(item.updated_at), "dd/MM/yyyy", { locale: ptBR })}
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter leading-tight">
                            {item.title}
                        </h1>

                        <div className="flex items-center gap-8 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-slate-950 flex items-center justify-center text-white text-[10px] font-black">
                                    {item.author_name?.charAt(0) || "R"}
                                </div>
                                <span>Revisão técnica: <span className="text-slate-950">{item.author_name || "Equipe Inox Link"}</span></span>
                            </div>
                            <div className="hidden md:flex items-center gap-2.5">
                                <Clock className="h-3 w-3" />
                                <span>Leitura técnica</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 md:px-6 pt-16">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        <div className="prose prose-slate prose-lg md:prose-xl max-w-none 
                  prose-headings:text-slate-950 prose-headings:font-black
                  prose-p:text-slate-600 prose-p:leading-relaxed
                  prose-strong:text-indigo-600 prose-strong:font-black
                  prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50 prose-blockquote:p-6 prose-blockquote:rounded-2xl prose-blockquote:not-italic
                  "
                            dangerouslySetInnerHTML={{ __html: item.content }}
                        />

                        <div className="mt-20 pt-10 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="outline" size="icon" className="rounded-full"><Share2 className="h-4 w-4" /></Button>
                                <span className="text-sm font-bold text-slate-400">CITAR ESTE ARTIGO</span>
                            </div>
                            <Link href="/wiki">
                                <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700">Ver outros tópicos</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar Navigation (Wiki Style) */}
                    <aside className="lg:w-1/4 hidden lg:block">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                                <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-indigo-500" /> Tabela de Conteúdo
                                </h4>
                                <ul className="space-y-4 text-sm font-bold">
                                    <li className="text-indigo-600 cursor-pointer">Visão Geral</li>
                                    <li className="text-slate-400 hover:text-slate-900 cursor-pointer transition-colors">Propriedades Gerais</li>
                                    <li className="text-slate-400 hover:text-slate-900 cursor-pointer transition-colors">Aplicações Comuns</li>
                                    <li className="text-slate-400 hover:text-slate-900 cursor-pointer transition-colors">Vantagens Técnicas</li>
                                    <li className="text-slate-400 hover:text-slate-900 cursor-pointer transition-colors">Referências</li>
                                </ul>
                            </div>

                            <div className="p-1 px-8 space-y-4">
                                <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Contribuição</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                    Encontrou um erro ou quer sugerir uma melhoria? Envie sua sugestão para nossa equipe técnica.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </article>
    );
}
