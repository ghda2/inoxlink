import React, { useState } from 'react';
import { actions } from 'astro:actions';
import Editor from './Editor';
import ImageUpload from './ImageUpload';
import SEOAnalyzer from './SEOAnalyzer';
import { aiService } from '../../services/ai';
import { Save, Loader2, Globe, FileText, Layout, Eye, ArrowLeft, Search, Sparkles } from 'lucide-react';


import { cn } from '../../scripts/utils';

interface NewsFormProps {
    initialData?: any;
    categories: any[];
    authors: any[];
}

export default function NewsForm({ initialData, categories, authors }: NewsFormProps) {
    const [loading, setLoading] = useState(false);
    const [aiSuggesting, setAiSuggesting] = useState(false);
    const [formData, setFormData] = useState({

        title: initialData?.title || '',
        slug: initialData?.slug || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        imageUrl: initialData?.imageUrl || '',
        categoryId: initialData?.categoryId || (categories[0]?.id || null),
        authorId: initialData?.authorId || (authors[0]?.id || null),
        published: initialData?.published || false,
        metaTitle: initialData?.metaTitle || '',
        metaDescription: initialData?.metaDescription || '',
        keywords: initialData?.keywords || '',
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
            let result;
            if (initialData?.id) {
                result = await actions.updateNews({ id: initialData.id, ...formData });
            } else {
                result = await actions.createNews(formData);
            }

            const { error } = result;

            if (error) {
                alert('Erro: ' + error.message);
            } else {
                window.location.href = '/admin/news';
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
                keywords: suggestion.keywords
            }));
        } catch (err) {
            alert('Falha ao obter sugestão da IA.');
        } finally {
            setAiSuggesting(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row min-h-screen bg-[#fcfcfc]">
            {/* Main Canvas */}
            <div className="flex-1 flex justify-center py-12 px-6 lg:px-12 bg-white min-h-screen border-r border-zinc-100 shadow-sm">
                <div className="w-full max-w-[800px] space-y-10">
                    <header className="flex items-center gap-3 text-zinc-400 mb-8">
                        <a href="/admin/news" className="hover:text-black transition-colors flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                            <ArrowLeft size={14} /> Painel
                        </a>
                        <span className="text-zinc-200">/</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{initialData?.id ? 'Editar' : 'Escrever'}</span>
                    </header>

                    <section className="space-y-6">
                        <input
                            type="text"
                            value={formData.title}
                            onChange={handleTitleChange}
                            required
                            placeholder="Adicione um título"
                            className="w-full bg-transparent border-none text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 placeholder:text-zinc-100 focus:outline-none focus:ring-0 p-0 leading-tight"
                        />

                        <div className="flex gap-6 border-b border-zinc-50 pb-8">
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-2 block">Resumo do post</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                    rows={2}
                                    placeholder="Uma breve introdução..."
                                    className="w-full bg-transparent border-none p-0 text-zinc-500 placeholder:text-zinc-200 focus:ring-0 outline-none text-lg leading-relaxed resize-none font-light italic"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="pb-32">
                        <Editor
                            content={formData.content}
                            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                        />
                    </div>
                </div>
            </div>

            {/* Gutenberg Sidebar */}
            <aside className="w-full lg:w-80 bg-[#fcfcfc] sticky top-0 h-screen overflow-y-auto p-0 border-l border-zinc-100">
                <div className="p-6 space-y-8">
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                        <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Configurações</h3>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg hover:bg-zinc-800 transition-all flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={12} /> : <Save size={12} />}
                                {initialData?.id ? 'Atualizar' : 'Publicar'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <section className="space-y-4">
                            <h4 className="text-[11px] font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                                <Globe size={14} className="text-zinc-400" /> Visibilidade
                            </h4>

                            <div className="flex bg-zinc-100 p-1 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, published: false }))}
                                    className={cn(
                                        "flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all",
                                        !formData.published ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400"
                                    )}
                                >
                                    Rascunho
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, published: true }))}
                                    className={cn(
                                        "flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all",
                                        formData.published ? "bg-black text-white shadow-sm" : "text-zinc-400"
                                    )}
                                >
                                    Público
                                </button>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h4 className="text-[11px] font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                                <Layout size={14} className="text-zinc-400" /> Taxonomia
                            </h4>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Categoria</label>
                                    <select
                                        value={formData.categoryId || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, categoryId: Number(e.target.value) }))}
                                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-bold text-zinc-900 outline-none"
                                    >
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Autor</label>
                                    <select
                                        value={formData.authorId || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, authorId: Number(e.target.value) }))}
                                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-bold text-zinc-900 outline-none"
                                    >
                                        {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <ImageUpload
                                label="Imagem de Destaque"
                                value={formData.imageUrl}
                                onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                            />
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[11px] font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                                    <Search size={14} className="text-zinc-400" /> Metadados SEO
                                </h4>
                                <button
                                    type="button"
                                    onClick={handleAiSuggest}
                                    disabled={aiSuggesting}
                                    className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors disabled:opacity-50"
                                >
                                    {aiSuggesting ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                                    Sugerir com IA
                                </button>
                            </div>


                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Título SEO (Opcional)</label>
                                    <input
                                        type="text"
                                        value={formData.metaTitle}
                                        onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                                        placeholder={formData.title}
                                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-bold text-zinc-900 outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Meta Descrição</label>
                                    <textarea
                                        value={formData.metaDescription}
                                        onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                                        rows={3}
                                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-medium text-zinc-600 outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </section>

                        <SEOAnalyzer
                            content={formData.content}
                            title={formData.metaTitle || formData.title}
                            description={formData.metaDescription || formData.excerpt}
                            focusKeyword={formData.keywords}
                            onKeywordChange={(val) => setFormData(prev => ({ ...prev, keywords: val }))}
                        />

                        <section className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Link Permanente</label>
                            <div className="bg-zinc-100 rounded-lg px-3 py-2 text-[10px] font-mono text-zinc-500 break-all">
                                inoxlink.com.br/news/{formData.slug}
                            </div>
                        </section>
                    </div>



                    <div className="pt-8 flex flex-col gap-3">
                        <button type="button" className="w-full py-3 border border-zinc-200 hover:bg-zinc-50 text-zinc-400 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                            <Eye size={14} /> Visualizar Prévia
                        </button>
                    </div>
                </div>
            </aside>
        </form >
    );
}
