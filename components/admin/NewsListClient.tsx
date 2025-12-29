"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { deleteNews } from "@/lib/actions/news";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { useState } from "react";

interface NewsListClientProps {
    news: any[];
}

export function NewsListClient({ news }: NewsListClientProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setSelectedNewsId(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedNewsId) {
            await deleteNews(selectedNewsId);
            setDeleteDialogOpen(false);
            setSelectedNewsId(null);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Notícias</h1>
                    <Link href="/admin/news/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Nova Notícia
                        </Button>
                    </Link>
                </div>

                <div className="rounded-md border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Título</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {news.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                                        Nenhuma notícia encontrada. Comece criando uma!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                news.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell>{item.category_name || "Sem categoria"}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${item.published
                                                    ? "bg-green-50 text-green-700 ring-green-600/20"
                                                    : "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                                                }`}>
                                                {item.published ? "Publicado" : "Rascunho"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(item.created_at), "dd/MM/yyyy", { locale: ptBR })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/news/edit/${item.slug}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-600"
                                                    onClick={() => handleDeleteClick(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                title="Deletar notícia?"
                description="Esta ação não pode ser desfeita. A notícia será permanentemente removida do banco de dados."
            />
        </>
    );
}
