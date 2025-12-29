import React from "react";
import { AdminSidebar } from "@/components/admin/sidebar";

export default function CmsRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="cms-layout flex min-h-screen bg-slate-50">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
