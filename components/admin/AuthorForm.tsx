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
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    slug: z.string().min(2, "Slug é obrigatório"),
    bio: z.string().optional(),
    avatar_url: z.string().optional(),
});

export function AuthorForm({ initialData, onSubmit, isEdit = false }: any) {
    const [isPending, setIsPending] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || { name: "", slug: "", bio: "", avatar_url: "" },
    });

    const generateSlug = (name: string) => {
        const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w ]+/g, "").replace(/ +/g, "-");
        form.setValue("slug", slug);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(async (v) => { setIsPending(true); await onSubmit(v); })} className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/authors"><Button variant="outline" size="icon" type="button"><ArrowLeft className="h-4 w-4" /></Button></Link>
                        <h1 className="text-3xl font-bold">{isEdit ? "Editar Autor" : "Novo Autor"}</h1>
                    </div>
                    <Button type="submit" disabled={isPending}>{isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />} Salvar</Button>
                </div>
                <div className="bg-white p-6 rounded-md border space-y-4 shadow-sm">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} onChange={(e) => { field.onChange(e); if (!isEdit) generateSlug(e.target.value); }} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="slug" render={({ field }) => (
                        <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="avatar_url" render={({ field }) => (
                        <FormItem><FormLabel>URL do Avatar</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="bio" render={({ field }) => (
                        <FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </form>
        </Form>
    );
}
