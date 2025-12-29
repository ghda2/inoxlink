"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Editor } from "@/components/admin/editor";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
    title: z.string().min(2, "Título deve ter pelo menos 2 caracteres"),
    slug: z.string().min(2, "Slug é obrigatório"),
    content: z.string().min(10, "Conteúdo deve ter pelo menos 10 caracteres"),
    author_id: z.string().optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
});

export function WikiForm({ initialData, authors, onSubmit, isEdit = false }: any) {
    const [isPending, setIsPending] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? { ...initialData, author_id: initialData.author_id?.toString() } : { title: "", slug: "", content: "", author_id: "", meta_title: "", meta_description: "" },
    });

    const generateSlug = (title: string) => {
        const slug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w ]+/g, "").replace(/ +/g, "-");
        form.setValue("slug", slug);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(async (v) => { setIsPending(true); await onSubmit(v); })} className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/wiki"><Button variant="outline" size="icon" type="button"><ArrowLeft className="h-4 w-4" /></Button></Link>
                        <h1 className="text-3xl font-bold">{isEdit ? "Editar Wiki" : "Nova Wiki"}</h1>
                    </div>
                    <Button type="submit" disabled={isPending}>{isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />} Salvar</Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-md border space-y-4 shadow-sm">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} onChange={(e) => { field.onChange(e); if (!isEdit) generateSlug(e.target.value); }} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="content" render={({ field }) => (
                                <FormItem><FormLabel>Conteúdo</FormLabel><FormControl><Editor value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-md border space-y-4 shadow-sm">
                            <h3 className="font-semibold">Configurações</h3>
                            <FormField control={form.control} name="slug" render={({ field }) => (
                                <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="author_id" render={({ field }) => (
                                <FormItem><FormLabel>Autor</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione um autor" /></SelectTrigger></FormControl>
                                        <SelectContent>{authors.map((a: any) => (<SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="bg-white p-6 rounded-md border space-y-4 shadow-sm">
                            <h3 className="font-semibold">SEO</h3>
                            <FormField control={form.control} name="meta_title" render={({ field }) => (
                                <FormItem><FormLabel>Meta Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="meta_description" render={({ field }) => (
                                <FormItem><FormLabel>Meta Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
