import React, { useState } from 'react';
import { actions } from 'astro:actions';
import Editor from './Editor';
import ImageUpload from './ImageUpload';
import { Save, Loader2, Globe, FileText, Layout, Eye, ArrowLeft } from 'lucide-react';
import { cn } from '../../scripts/utils';

interface NewsFormProps {
    initialData?: any;
    categories: any[];
    authors: any[];
}

export default function NewsForm({ initialData, categories, authors }: NewsFormProps) {
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

    return (
        <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-12">
            <div className="flex-1 space-y-12">
                <header className="flex items-center gap-4 text-zinc-500 mb-4">
                    <a href="/admin/news" className="hover:text-white transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                        <ArrowLeft size={16} /> Voltar
                    </a>
                    <span className="text-zinc-800">|</span>
                    <span className="text-xs font-bold uppercase tracking-widest">{initialData?.id ? 'Editar Matéria' : 'Novo Rascunho'}</span>
                </header>

                <section className="space-y-4">
                    <input
                        type="text"
                        value={formData.title}
                        onChange={handleTitleChange}
                        required
                        placeholder="TÍTULO DA MATÉRIA..."
                        className="w-full bg-transparent border-none text-4xl lg:text-6xl font-black italic tracking-tighter placeholder:text-zinc-900 focus:outline-none focus:ring-0 uppercase p-0"
                    />
                    <div className="h-2 w-32 bg-white"></div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Resumo Manual</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                            rows={4}
                            placeholder="Escreva um breve resumo atrativo..."
                            className="w-full bg-zinc-900 border-none rounded-2xl p-5 text-white focus:ring-2 focus:ring-white/20 transition-all placeholder:text-zinc-700"
                        />
                    </div>

                    <ImageUpload
                        label="Capa da Matéria"
                        value={formData.imageUrl}
                        onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Corpo do Conteúdo</label>
                    <Editor
                        content={formData.content}
                        onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                    />
                </div>
            </div>

            <aside className="w-full xl:w-96 space-y-8">
                <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 sticky top-32 space-y-8 backdrop-blur-xl">
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <Globe size={16} /> Publicação
                        </h3>

                        <div className="flex bg-black p-1.5 rounded-2xl border border-white/5">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, published: false }))}
                                className={cn(
                                    "flex-1 py-3 px-4 rounded-xl text-xs font-black tracking-widest uppercase transition-all",
                                    !formData.published ? "bg-zinc-800 text-white shadow-xl" : "text-zinc-600 hover:text-zinc-400"
                                )}
                            >
                                Rascunho
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, published: true }))}
                                className={cn(
                                    "flex-1 py-3 px-4 rounded-xl text-xs font-black tracking-widest uppercase transition-all",
                                    formData.published ? "bg-white text-black shadow-xl" : "text-zinc-600 hover:text-zinc-400"
                                )}
                            >
                                Público
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">URL Slug</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-white focus:border-white/20 outline-none"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-white/5"></div>

                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <Layout size={16} /> Estrutura
                        </h3>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Categoria</label>
                            <select
                                value={formData.categoryId || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: Number(e.target.value) }))}
                                className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none appearance-none"
                            >
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                            </select>
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
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 text-black rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {initialData?.id ? 'Atualizar Dados' : 'Finalizar Artigo'}
                        </button>
                        <button type="button" className="w-full py-4 border border-white/10 hover:bg-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                            <Eye size={14} /> Pré-visualizar
                        </button>
                    </div>
                </div>
            </aside>
        </form>
    );
}
