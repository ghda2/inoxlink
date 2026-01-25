import React, { useState } from 'react';
import { actions } from 'astro:actions';
import Editor from './Editor';
import ImageUpload from './ImageUpload';
import { Save, Loader2, Globe, Layout, Eye, ArrowLeft } from 'lucide-react';
import { cn } from '../../scripts/utils';

type ContentType = 'news' | 'wiki';

interface ContentFormProps {
    type: ContentType;
    initialData?: any;
    categories: any[];
    authors: any[];
}

const CONFIG = {
    news: {
        title: 'Matéria',
        backUrl: '/admin/news',
        createAction: 'createNews',
        updateAction: 'updateNews',
        showExcerpt: true,
        showPublished: true,
        showCategory: true,
        showAuthor: true,
        showImage: true,
    },
    wiki: {
        title: 'Artigo Wiki',
        backUrl: '/admin/wiki',
        createAction: 'createWiki',
        updateAction: 'updateWiki',
        showExcerpt: false,
        showPublished: false,
        showCategory: true,
        showAuthor: true,
        showImage: true,
    },
};

export default function ContentForm({ type, initialData, categories, authors }: ContentFormProps) {
    const config = CONFIG[type];
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        imageUrl: initialData?.imageUrl || '',
        categoryId: initialData?.categoryId || (categories[0]?.id || null),
        authorId: initialData?.authorId || (authors[0]?.id || null),
        published: initialData?.published || false,
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
            const actionName = initialData?.id ? config.updateAction : config.createAction;
            const actionData = initialData?.id ? { id: initialData.id, ...formData } : formData;

            // @ts-ignore - dynamic action calling
            result = await actions[actionName](actionData);

            const { error } = result;

            if (error) {
                alert('Erro: ' + error.message);
            } else {
                window.location.href = config.backUrl;
            }
        } catch (err) {
            console.error(err);
            alert('Erro inesperado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row min-h-screen bg-[#fcfcfc]">
            {/* Main Canvas */}
            <div className="flex-1 flex justify-center py-12 px-6 lg:px-12 bg-white min-h-screen border-r border-zinc-100 shadow-sm">
                <div className="w-full max-w-[800px] space-y-10">
                    <header className="flex items-center gap-3 text-zinc-400 mb-8">
                        <a href={config.backUrl} className="hover:text-black transition-colors flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                            <ArrowLeft size={14} /> Painel
                        </a>
                        <span className="text-zinc-200">/</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                            {initialData?.id ? `Editar ${config.title}` : `Nova ${config.title}`}
                        </span>
                    </header>

                    <section className="space-y-6">
                        <input
                            type="text"
                            value={formData.title}
                            onChange={handleTitleChange}
                            required
                            placeholder="Adicione um título"
                            className="w-full bg-transparent border-none text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-zinc-900 placeholder:text-zinc-100 focus:outline-none focus:ring-0 p-0"
                        />

                        {config.showExcerpt && (
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
                        )}
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
                        {config.showPublished && (
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
                        )}

                        <section className="space-y-4">
                            <h4 className="text-[11px] font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                                <Layout size={14} className="text-zinc-400" /> Taxonomia
                            </h4>

                            <div className="space-y-4">
                                {config.showCategory && (
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
                                )}

                                {config.showAuthor && (
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
                                )}
                            </div>
                        </section>

                        {config.showImage && (
                            <section className="space-y-4">
                                <ImageUpload
                                    label="Imagem de Destaque"
                                    value={formData.imageUrl}
                                    onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                                />
                            </section>
                        )}

                        <section className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Link Permanente</label>
                            <div className="bg-zinc-100 rounded-lg px-3 py-2 text-[10px] font-mono text-zinc-500 break-all">
                                inoxlink.com.br/{type}/{formData.slug}
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
        </form>
    );
}
