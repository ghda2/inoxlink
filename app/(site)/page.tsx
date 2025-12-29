import { db } from "@/lib/db";
import { NewsCard } from "@/components/site/NewsCard";
import { ArrowRight, Zap, TrendingUp, BookOpen } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function Home() {
  // Fetch latest news
  const newsResult = await db.query(`
    SELECT n.*, c.name as category_name, a.name as author_name 
    FROM news n 
    LEFT JOIN categories c ON n.category_id = c.id 
    LEFT JOIN authors a ON n.author_id = a.id
    WHERE n.published = true
    ORDER BY n.published_at DESC
    LIMIT 15
  `);
  const news = newsResult.rows;

  // Split into featured and others
  const mainFeatured = news[0];
  const secondaryHighlights = news.slice(1, 4);
  const latestNews = news.slice(4);

  return (
    <div className="pb-20 space-y-12 md:space-y-20">
      {/* Hero Section Grid */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-6">
        <div className="absolute top-0 left-0 w-full h-[65%] md:h-[55%] bg-slate-950 -z-10 rounded-b-[2.5rem] md:rounded-b-[5rem]" />

        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">

            {/* Left Side: Main Featured */}
            <div className="lg:col-span-8 flex">
              {mainFeatured ? (
                <div className="w-full">
                  <NewsCard item={mainFeatured} featured={true} />
                </div>
              ) : (
                <div className="w-full min-h-[300px] md:min-h-[400px] flex items-center justify-center text-white/10 border-2 border-dashed border-white/10 rounded-[2rem] md:rounded-[3rem]">
                  Nenhuma notícia disponível.
                </div>
              )}
            </div>

            {/* Right Column: Secondary Highlights */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {secondaryHighlights.length > 0 ? (
                secondaryHighlights.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.slug}`}
                    className="flex-1 group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-slate-900 border border-slate-800 p-5 md:p-6 flex flex-col justify-end min-h-[140px] md:min-h-[160px]"
                  >
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="relative z-10 space-y-2">
                      <Badge className="bg-slate-800 text-slate-400 group-hover:bg-white group-hover:text-black transition-colors border-none text-[10px] uppercase font-black px-2 py-0">
                        {item.category_name}
                      </Badge>
                      <h3 className="text-sm md:text-base font-bold text-white leading-tight group-hover:text-slate-300 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="h-full bg-slate-900 rounded-[2rem] border border-dashed border-slate-800 flex items-center justify-center text-slate-700 font-bold italic py-8 md:py-0">
                  Mais destaques em breve
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Latest News & Categories */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Main Feed */}
          <div className="lg:w-2/3 space-y-8">
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 md:h-8 bg-black rounded-full" />
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">Artigos Recentes</h2>
              </div>
              <Link href="/news" className="text-slate-900 font-bold text-sm md:text-base flex items-center gap-2 hover:gap-3 transition-all">
                Ver todas <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {latestNews.length > 0 ? (
                latestNews.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))
              ) : (
                <div className="text-slate-400 py-20 text-center bg-slate-50 rounded-3xl border border-slate-100">
                  Explore nosso painel para adicionar mais conteúdo!
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Trending */}
          <aside className="lg:w-1/3 space-y-12">

            {/* Newsletter Sidebox */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group border border-slate-800">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <Zap className="h-10 w-10 mb-6 text-slate-400" />
              <h3 className="text-2xl font-black mb-4 leading-tight">Mantenha-se à frente</h3>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed font-medium">
                Análises exclusivas e insights que você não encontrará em nenhum outro lugar.
              </p>
              <div className="space-y-3">
                <input placeholder="Seu e-mail" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 transition-all font-medium" />
                <Button className="w-full bg-white text-black hover:bg-slate-200 font-bold border-none shadow-lg py-6 rounded-xl">Inscrever-se</Button>
              </div>
            </div>

            {/* trending? (Just static for design for now) */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-5 w-5 text-slate-900" />
                <h3 className="text-xl font-black uppercase tracking-widest text-xs text-slate-400">Tópicos em Alta</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Tecnologia", "Sustentabilidade", "IA", "Inovação", "Indústria 4.0", "Inox"].map(tag => (
                  <span key={tag} className="px-5 py-2.5 bg-white hover:bg-black hover:text-white rounded-xl text-xs font-bold text-slate-600 transition-all cursor-pointer border border-slate-100 shadow-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Wiki Corner */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-slate-900" />
                <h3 className="text-xl font-black uppercase tracking-widest text-xs text-slate-400">Enciclopédia Inox</h3>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl space-y-5 border border-slate-100">
                <p className="text-sm text-slate-600 italic font-medium leading-relaxed">"Descubra tudo sobre materiais, processos industriais e a história do aço inoxidável."</p>
                <Link href="/wiki">
                  <Button variant="outline" className="w-full rounded-xl border-slate-200 text-slate-900 font-bold hover:bg-black hover:text-white hover:border-black transition-all">Acessar Wiki completo</Button>
                </Link>
              </div>
            </div>

          </aside>
        </div>
      </section>
    </div>
  );
}