import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = products.filter((p) => p.stock <= 5 && p.active).length;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Administrar Productos</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} productos · Valor total: ${totalValue.toFixed(2)}{lowStock > 0 ? ` · ⚠️ ${lowStock} con stock bajo` : ""}</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition text-sm font-medium shadow-sm"
        >
          + Nuevo Producto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-600">Producto</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Categoría</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Precio</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Stock</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">Estado</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image ? (
                      <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">📦</div>
                    )}
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.category}</td>
                <td className="px-4 py-3 text-right font-medium">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={p.stock <= 5 && p.active ? "text-red-600 font-semibold" : ""}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${p.id}`} className="text-emerald-600 hover:text-emerald-700 font-medium text-xs">
                    Editar →
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  <div className="text-3xl mb-2">📦</div>
                  No hay productos registrados
                  <br />
                  <Link href="/admin/products/new" className="text-emerald-600 hover:underline text-sm mt-2 inline-block">Crear el primero</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
