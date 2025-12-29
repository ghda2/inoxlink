import { db } from "@/lib/db";

export default async function AdminDashboard() {
    const newsResult = await db.query("SELECT COUNT(*) FROM news");
    const categoriesResult = await db.query("SELECT COUNT(*) FROM categories");
    const authorsResult = await db.query("SELECT COUNT(*) FROM authors");

    const newsCount = newsResult.rows[0].count;
    const categoriesCount = categoriesResult.rows[0].count;
    const authorsCount = authorsResult.rows[0].count;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Total de Notícias</h3>
                    <p className="text-3xl font-bold mt-2">{newsCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Categorias</h3>
                    <p className="text-3xl font-bold mt-2">{categoriesCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Autores</h3>
                    <p className="text-3xl font-bold mt-2">{authorsCount}</p>
                </div>
            </div>
        </div>
    );
}
