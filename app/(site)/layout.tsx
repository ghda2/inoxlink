import { db } from "@/lib/db";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = (await db.query("SELECT * FROM categories ORDER BY name ASC")).rows;

  return (
    <div className="site-layout flex min-h-screen flex-col font-sans antialiased text-slate-900">
      <Navbar categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}