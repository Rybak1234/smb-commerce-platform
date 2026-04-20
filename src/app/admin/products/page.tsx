import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice } from "@/lib/utils";
import { Package, Plus, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, vendor: true },
  });
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = products.filter((p) => p.stock <= (p.lowStockThreshold || 5) && p.active).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {products.length} productos · Valor: {formatPrice(totalValue)}
            {lowStock > 0 && <span className="text-orange-500 ml-2">· {lowStock} stock bajo</span>}
          </p>
        </div>
        <Link href="/admin/products/new" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 text-sm font-medium">
          <Plus className="h-4 w-4" />Nuevo Producto
        </Link>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Producto</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Categoría</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Vendedor</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Precio</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Stock</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Estado</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden shrink-0">
                      <ProductImage src={p.images?.[0]} alt={p.name} width={40} height={40} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-medium block truncate max-w-[200px]">{p.name}</span>
                      {p.sku && <span className="text-xs text-muted-foreground">SKU: {p.sku}</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.category?.name || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{p.vendor?.storeName || "SurtiBolivia"}</td>
                <td className="px-4 py-3 text-right font-medium">{formatPrice(p.price)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={p.stock <= (p.lowStockThreshold || 5) && p.active ? "text-orange-500 font-semibold flex items-center justify-end gap-1" : ""}>
                    {p.stock <= (p.lowStockThreshold || 5) && p.active && <AlertTriangle className="h-3 w-3" />}
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.active ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                    {p.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${p.id}`} className="text-primary hover:underline text-xs font-medium">Editar →</Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <p>No hay productos</p>
                <Link href="/admin/products/new" className="text-primary hover:underline text-sm mt-2 inline-block">Crear el primero</Link>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
