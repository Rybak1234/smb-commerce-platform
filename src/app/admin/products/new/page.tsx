"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name"),
      description: fd.get("description"),
      price: parseFloat(fd.get("price") as string),
      originalPrice: fd.get("originalPrice") ? parseFloat(fd.get("originalPrice") as string) : null,
      image: fd.get("image") || null,
      category: fd.get("category") || "General",
      badge: fd.get("badge") || null,
      featured: fd.get("featured") === "on",
      stock: parseInt(fd.get("stock") as string) || 0,
      active: fd.get("active") === "on",
    };
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.push("/admin/products");
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <Link href="/admin/products" className="text-sm text-teal-600 hover:underline mb-4 inline-block">
        ← Volver a productos
      </Link>
      <h1 className="text-2xl font-bold mb-6">Nuevo Producto</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input name="name" required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-200 focus:border-teal-500 outline-none transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea name="description" rows={3} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-200 focus:border-teal-500 outline-none transition" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
            <input name="price" type="number" step="0.01" min="0" required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-200 focus:border-teal-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Original</label>
            <input name="originalPrice" type="number" step="0.01" min="0" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-200 focus:border-teal-500 outline-none transition" placeholder="Para mostrar descuento" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input name="stock" type="number" min="0" defaultValue="0" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-200 focus:border-teal-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
            <select name="badge" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-200 focus:border-teal-500 outline-none transition">
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
          <input name="category" defaultValue="General" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-200 focus:border-teal-500 outline-none transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
          <input
            name="image"
            type="url"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-200 focus:border-teal-500 outline-none transition"
            placeholder="https://..."
            onChange={(e) => setImagePreview(e.target.value)}
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg border" onError={() => setImagePreview("")} />
          )}
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input name="active" type="checkbox" defaultChecked className="rounded text-teal-600 focus:ring-teal-500" />
            <span className="text-sm text-gray-700">Producto activo</span>
          </label>
          <label className="flex items-center gap-2">
            <input name="featured" type="checkbox" className="rounded text-teal-600 focus:ring-teal-500" />
            <span className="text-sm text-gray-700">Producto destacado</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 disabled:opacity-50 transition font-medium"
        >
          {saving ? "Guardando..." : "Crear Producto"}
        </button>
      </form>
    </div>
  );
}
