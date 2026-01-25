import React, { useState } from 'react';
import { actions } from 'astro:actions';
import Editor from './Editor';
import SEOAnalyzer from './SEOAnalyzer';
import { aiService } from '../../services/ai';
import { Save, Loader2, FileText, ArrowLeft, Search, Sparkles } from 'lucide-react';



interface WikiFormProps {
    initialData?: any;
    authors: any[];
}

export default function WikiForm({ initialData, authors }: WikiFormProps) {
    const [loading, setLoading] = useState(false);
    const [aiSuggesting, setAiSuggesting] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        content: initialData?.content || '',
        authorId: initialData?.authorId || (authors[0]?.id || null),
        categoryId: initialData?.categoryId || null,
        metaTitle: initialData?.metaTitle || '',
        metaDescription: initialData?.metaDescription || '',
        tags: initialData?.tags || '', // Using tags field as keywords fallback or just tags
    });


    const generateSlug = (title: string) => {
        return title.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            slug: prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await actions.createWiki(formData);

            if (error) {
                alert('Erro: ' + error.message);
            } else {
                window.location.href = '/admin/wiki';
            }
        } catch (err) {
            console.error(err);
            alert('Erro inesperado');
        } finally {
            setLoading(false);
        }
    };

    const handleAiSuggest = async () => {
        if (!formData.content || formData.content.length < 50) {
            alert('Escreva um pouco mais de conteúdo para que a IA possa analisar.');
            return;
        }

        setAiSuggesting(true);
        try {
            const suggestion = await aiService.suggestMetadata(formData.content, formData.title);
            setFormData(prev => ({
                ...prev,
                metaTitle: suggestion.title,
                metaDescription: suggestion.description,
                tags: suggestion.keywords
            }));
        } catch (err) {
            alert('Falha ao obter sugestão da IA.');
        } finally {
            setAiSuggesting(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-12">
            <div className="flex-1 space-y-12">
                <header className="flex items-center gap-4 text-zinc-500 mb-4">
                    <a href="/admin/wiki" className="hover:text-white transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                        <ArrowLeft size={16} /> Voltar
                    </a>
                    <span className="text-zinc-800">|</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Novo Artigo Wiki</span>
                </header>

                <section className="space-y-4">
                    <input
                        type="text"
                        value={formData.title}
                        onChange={handleTitleChange}
                        required
                        placeholder="TÍTULO DO ARTIGO..."
                        className="w-full bg-transparent border-none text-4xl lg:text-5xl font-black italic tracking-tighter placeholder:text-zinc-900 focus:outline-none focus:ring-0 uppercase p-0"
                    />
                    <div className="h-2 w-32 bg-white"></div>
                </section>

                <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Documentação Técnica</label>
                    <Editor
                        content={formData.content}
                        onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                    />
                </div>
            </div>

            <aside className="w-full xl:w-80 space-y-8">
                <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 sticky top-32 space-y-8 backdrop-blur-xl">
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <FileText size={16} /> Configurações
                        </h3>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">URL Slug</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-white focus:border-white/20 outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Autor Responsável</label>
                            <select
                                value={formData.authorId || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, authorId: Number(e.target.value) }))}
                                className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none appearance-none"
                            >
                                {authors.map(a => <option key={a.id} value={a.id}>{a.name.toUpperCase()}</option>)}
                            </select>
                        </div>

                        <div className="space-y-4 border-t border-white/5 pt-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Search size={16} className="text-zinc-500" /> SEO
                                </h4>
                                <button
                                    type="button"
                                    onClick={handleAiSuggest}
                                    disabled={aiSuggesting}
                                    className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                                >
                                    {aiSuggesting ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                                    Auto IA
                                </button>
                            </div>


                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Título SEO</label>
                                    <input
                                        type="text"
                                        value={formData.metaTitle}
                                        onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                                        placeholder={formData.title}
                                        className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-white/20 outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Meta Descrição</label>
                                    <textarea
                                        value={formData.metaDescription}
                                        onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                                        rows={3}
                                        className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-xs text-zinc-300 focus:border-white/20 outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="text-zinc-900">
                            <SEOAnalyzer
                                content={formData.content}
                                title={formData.metaTitle || formData.title}
                                description={formData.metaDescription}
                                focusKeyword={(formData.tags as any) || ''}
                                onKeywordChange={(val) => setFormData(prev => ({ ...prev, tags: val }))}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 text-black rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Salvar Artigo
                    </button>
                </div>
            </aside>
        </form>
    );
}
