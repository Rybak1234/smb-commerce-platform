"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name"),
      description: fd.get("description"),
      price: parseFloat(fd.get("price") as string),
      image: fd.get("image") || null,
      category: fd.get("category") || "General",
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
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nuevo Producto</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre *</label>
          <input name="name" required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea name="description" rows={3} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio *</label>
            <input name="price" type="number" step="0.01" min="0" required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input name="stock" type="number" min="0" defaultValue="0" className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <input name="category" defaultValue="General" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL de Imagen</label>
          <input name="image" type="url" className="w-full border rounded px-3 py-2" placeholder="https://..." />
        </div>
        <label className="flex items-center gap-2">
          <input name="active" type="checkbox" defaultChecked />
          <span className="text-sm">Producto activo</span>
        </label>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 disabled:opacity-50 transition"
        >
          {saving ? "Guardando..." : "Crear Producto"}
        </button>
      </form>
    </div>
  );
}
