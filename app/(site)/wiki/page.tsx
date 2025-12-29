import { db } from "@/lib/db";
import { Search, Book, Bookmark, Compass, Sparkles, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function WikiHomePage() {
    const wikiResult = await db.query(`
    SELECT w.*, a.name as author_name 
    FROM wiki w 
    LEFT JOIN authors a ON w.author_id = a.id 
    ORDER BY w.updated_at DESC
  `);
    const wikiItems = wikiResult.rows;

    return (
        <div className="pb-24">
            {/* Search/Header Hero */}
            <section className="bg-slate-950 pt-40 pb-24 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]" />
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center space-y-8">
                    <Badge className="bg-slate-800 text-slate-400 border-slate-700 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                        <Sparkles className="h-3.5 w-3.5 mr-2" /> Enciclopédia Técnica
                    </Badge>
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter max-w-4xl mx-auto leading-tight">
                        Universo do <span className="text-slate-500">Aço Inoxidável</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                        Conhecimento técnico aprofundado sobre materiais, processos industriais e normas em um só lugar.
                    </p>

                    <div className="max-w-xl mx-auto relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-white transition-colors" />
                        <Input
                            placeholder="Pesquisar termo técnico..."
                            className="w-full h-14 bg-slate-900 border-slate-800 rounded-2xl pl-12 text-lg focus:ring-slate-500 focus:bg-slate-900 focus:border-slate-700 transition-all font-medium text-white placeholder:text-slate-600"
                        />
                    </div>
                </div>
            </section>

            {/* Topics / Navigation */}
            <section className="container mx-auto px-4 md:px-6 -mt-12 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Materiais", icon: Bookmark, color: "bg-slate-800" },
                        { label: "Processos", icon: Compass, color: "bg-slate-800" },
                        { label: "Aplicações", icon: Book, color: "bg-slate-800" },
                        { label: "Normas Técnicas", icon: Sparkles, color: "bg-slate-800" },
                    ].map((topic) => (
                        <div key={topic.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-4 group cursor-pointer hover:bg-black hover:border-black transition-all">
                            <div className={`${topic.color} p-3 rounded-2xl text-white shadow-lg shadow-current/5 group-hover:scale-110 transition-transform border border-slate-700`}>
                                <topic.icon className="h-6 w-6" />
                            </div>
                            <span className="font-bold text-slate-900 text-lg group-hover:text-white transition-colors">{topic.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Main List */}
            <section className="container mx-auto px-4 md:px-6 pt-20">
                <div className="flex items-center gap-3 mb-10 pb-4 border-b border-slate-100">
                    <div className="w-1.5 h-8 bg-black rounded-full" />
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Artigos Técnicos</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wikiItems.length > 0 ? (
                        wikiItems.map((item) => (
                            <Link key={item.id} href={`/wiki/${item.slug}`} className="group bg-white p-8 rounded-[2rem] border border-slate-100 hover:shadow-2xl hover:border-black transition-all flex flex-col justify-between overflow-hidden relative">
                                <div className="space-y-4 relative z-10">
                                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-black transition-colors leading-tight tracking-tight">
                                        {item.title}
                                    </h3>
                                    <div className="text-slate-500 line-clamp-3 text-sm leading-relaxed font-medium"
                                        dangerouslySetInnerHTML={{ __html: item.content.substring(0, 150) + "..." }}
                                    />
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revisão: {item.author_name || "Redação"}</span>
                                    <Button variant="ghost" size="sm" className="text-black font-black uppercase text-[10px] tracking-widest group-hover:gap-3 transition-all hover:bg-transparent p-0">
                                        Ver Artigo <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center text-slate-400 bg-slate-50 rounded-3xl font-medium">
                            Nenhum artigo da Wiki encontrado ainda.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
