"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  image: string | null;
  category: string;
  badge: string | null;
  featured: boolean;
  stock: number;
  active: boolean;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then(setProduct);
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name"),
      description: fd.get("description") || null,
      price: parseFloat(fd.get("price") as string),
      originalPrice: fd.get("originalPrice") ? parseFloat(fd.get("originalPrice") as string) : null,
      image: fd.get("image") || null,
      category: fd.get("category") || "General",
      badge: fd.get("badge") || null,
      featured: fd.get("featured") === "on",
      stock: parseInt(fd.get("stock") as string) || 0,
      active: fd.get("active") === "on",
    };
    await fetch(`/api/products/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.push("/admin/products");
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este producto permanentemente?")) return;
    setDeleting(true);
    await fetch(`/api/products/${params.id}`, { method: "DELETE" });
    router.push("/admin/products");
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <Link href="/admin/products" className="text-sm text-indigo-600 hover:underline mb-4 inline-block">
        ← Volver a productos
      </Link>
      <h1 className="text-2xl font-bold mb-6">Editar Producto</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input name="name" required defaultValue={product.name} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea name="description" rows={3} defaultValue={product.description || ""} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
            <input name="price" type="number" step="0.01" min="0" required defaultValue={product.price} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Original</label>
            <input name="originalPrice" type="number" step="0.01" min="0" defaultValue={product.originalPrice || ""} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition" placeholder="Para mostrar descuento" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input name="stock" type="number" min="0" defaultValue={product.stock} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
            <select name="badge" defaultValue={product.badge || ""} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition">
              <option value="">Sin badge</option>
              <option value="Nuevo">Nuevo</option>
              <option value="Oferta">Oferta</option>
              <option value="Más vendido">Más vendido</option>
              <option value="Popular">Popular</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <input name="category" defaultValue={product.category} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
          <input name="image" type="url" defaultValue={product.image || ""} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition" placeholder="https://..." />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input name="active" type="checkbox" defaultChecked={product.active} className="rounded text-indigo-600 focus:ring-indigo-500" />
            <span className="text-sm text-gray-700">Producto activo</span>
          </label>
          <label className="flex items-center gap-2">
            <input name="featured" type="checkbox" defaultChecked={product.featured} className="rounded text-indigo-600 focus:ring-indigo-500" />
            <span className="text-sm text-gray-700">Producto destacado</span>
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition font-medium"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 transition text-sm font-medium"
          >
            {deleting ? "..." : "Eliminar"}
          </button>
        </div>
      </form>
    </div>
  );
}
