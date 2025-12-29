import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar, User, ArrowUpRight } from "lucide-react";

interface NewsCardProps {
    item: any;
    featured?: boolean;
}

export function NewsCard({ item, featured = false }: NewsCardProps) {
    const publishedAt = item.published_at ? new Date(item.published_at) : new Date(item.created_at);

    if (featured) {
        return (
            <Link href={`/news/${item.slug}`} className="group relative block w-full overflow-hidden rounded-3xl bg-slate-950 aspect-[16/9] md:aspect-[21/9] border border-slate-800">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                <div className="absolute inset-0 bg-slate-800/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20 space-y-4">
                    <Badge className="bg-white text-slate-950 hover:bg-slate-200 border-none py-1.5 px-4 text-sm font-bold mb-2">
                        {item.category_name}
                    </Badge>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight group-hover:text-slate-300 transition-colors">
                        {item.title}
                    </h2>
                    <p className="text-slate-400 text-lg line-clamp-2 max-w-3xl font-medium">
                        {item.excerpt || "Confira todos os detalhes sobre esta notícia que está movimentando o setor..."}
                    </p>
                    <div className="flex items-center gap-6 text-slate-500 pt-2 font-medium">
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-slate-400" />
                            <span>{item.author_name || "Redação"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-slate-400" />
                            <span>{format(publishedAt, "d 'de' MMMM", { locale: ptBR })}</span>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/news/${item.slug}`} className="group flex flex-col md:flex-row gap-6 bg-white p-4 rounded-3xl border border-slate-100 hover:shadow-2xl hover:border-slate-300 transition-all duration-300">
            <div className="w-full md:w-64 h-48 rounded-2xl bg-slate-50 overflow-hidden relative shrink-0 border border-slate-100">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <>
                        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]" />
                        <div className="flex items-center justify-center h-full text-slate-300 font-bold uppercase tracking-widest text-xs">
                            Inox Link
                        </div>
                    </>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
            </div>

            <div className="flex flex-col justify-between py-2 flex-1">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-slate-600 border-slate-200 bg-slate-50">
                            {item.category_name}
                        </Badge>
                        <ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-black transition-colors leading-snug">
                        {item.title}
                    </h3>
                    <p className="text-slate-500 line-clamp-2 text-sm">
                        {item.excerpt || "Leia mais sobre este assunto e fique por dentro das atualizações do mercado."}
                    </p>
                </div>

                <div className="flex items-center gap-4 mt-4 text-xs text-slate-400 border-t border-slate-50 pt-4">
                    <div className="px-2 py-1 bg-slate-100 rounded-md font-bold text-slate-600">
                        {format(publishedAt, "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                    <span className="font-semibold text-slate-900">{item.author_name || "Redação"}</span>
                </div>
            </div>
        </Link>
    );
}
