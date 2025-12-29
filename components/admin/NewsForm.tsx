"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Editor } from "@/components/admin/editor";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
    title: z.string().min(2, "O título deve ter pelo menos 2 caracteres"),
    slug: z.string().min(2, "O slug é obrigatório"),
    category_id: z.string({ required_error: "Selecione uma categoria" }),
    author_id: z.string().optional(),
    content: z.string().min(10, "O conteúdo deve ter pelo menos 10 caracteres"),
    excerpt: z.string().optional(),
    image_url: z.string().url("Insira uma URL válida para a imagem").or(z.literal("")).optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().max(160).optional(),
});

export function NewsForm({ initialData, categories, authors, onSubmit, isEdit = false }: any) {
    const [isPending, setIsPending] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            slug: initialData?.slug || "",
            content: initialData?.content || "",
            excerpt: initialData?.excerpt || "",
            image_url: initialData?.image_url || "",
            category_id: initialData?.category_id?.toString() || "",
            author_id: initialData?.author_id?.toString() || "",
            meta_title: initialData?.meta_title || "",
            meta_description: initialData?.meta_description || "",
        },
    });

    const generateSlug = (title: string) => {
        const slug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w ]+/g, "").replace(/ +/g, "-");
        form.setValue("slug", slug);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(async (v) => { setIsPending(true); await onSubmit(v); })} className="space-y-6 pb-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/news"><Button variant="outline" size="icon" type="button"><ArrowLeft className="h-4 w-4" /></Button></Link>
                        <h1 className="text-3xl font-bold">{isEdit ? "Editar Notícia" : "Nova Notícia"}</h1>
                    </div>
                    <Button type="submit" disabled={isPending}>{isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />} Salvar</Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} onChange={(e) => { field.onChange(e); if (!isEdit) generateSlug(e.target.value); }} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="content" render={({ field }) => (
                            <FormItem><FormLabel>Conteúdo</FormLabel><FormControl><Editor value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="excerpt" render={({ field }) => (
                            <FormItem><FormLabel>Resumo</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="image_url" render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL da Imagem de Destaque</FormLabel>
                                <FormControl><Input placeholder="https://exemplo.com/imagem.jpg" {...field} /></FormControl>
                                <FormDescription>URL da imagem principal que aparecerá no topo da notícia.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-md border bg-white p-6 space-y-6 shadow-sm">
                            <h3 className="font-semibold text-lg">Publicação</h3>
                            <FormField control={form.control} name="slug" render={({ field }) => (
                                <FormItem><FormLabel>Slug (URL)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="category_id" render={({ field }) => (
                                <FormItem><FormLabel>Categoria</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione categoria" /></SelectTrigger></FormControl>
                                        <SelectContent>{categories.map((c: any) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="author_id" render={({ field }) => (
                                <FormItem><FormLabel>Autor</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione autor" /></SelectTrigger></FormControl>
                                        <SelectContent>{authors.map((a: any) => <SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="rounded-md border bg-white p-6 space-y-6 shadow-sm">
                            <h3 className="font-semibold text-lg">SEO</h3>
                            <FormField control={form.control} name="meta_title" render={({ field }) => (
                                <FormItem><FormLabel>Meta Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="meta_description" render={({ field }) => (
                                <FormItem><FormLabel>Meta Description</FormLabel><FormControl><Textarea className="h-24" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
