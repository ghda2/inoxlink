"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { useState, useTransition } from "react";

export function AdminListClient({ items, columns, title, createLink, editUrlPrefix, deleteAction }: any) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (selectedId) {
            startTransition(async () => {
                await deleteAction(selectedId);
                setDeleteDialogOpen(false);
                setSelectedId(null);
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{title}</h1>
                <Link href={createLink}><Button><Plus className="mr-2 h-4 w-4" /> Novo Item</Button></Link>
            </div>
            <div className="bg-white border rounded-md">
                <Table>
                    <TableHeader><TableRow>
                        {columns.map((col: any) => <TableHead key={col.key}>{col.label}</TableHead>)}
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                        {items.length === 0 ? <TableRow><TableCell colSpan={columns.length + 1} className="text-center py-10 text-gray-500">Nenhum item encontrado.</TableCell></TableRow> :
                            items.map((item: any) => (
                                <TableRow key={item.id} className={isPending && selectedId === item.id ? "opacity-50" : ""}>
                                    {columns.map((col: any) => <TableCell key={col.key}>{item[col.key]}</TableCell>)}
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`${editUrlPrefix}/${item.slug}`}><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></Link>
                                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => { setSelectedId(item.id); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDelete}
            />
        </div>
    );
}
