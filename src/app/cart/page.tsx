"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("cart");
  return raw ? JSON.parse(raw) : [];
}

function saveCart(items: CartItem[]) {
  localStorage.setItem("cart", JSON.stringify(items));
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => setItems(getCart()), []);

  const updateQty = (id: string, delta: number) => {
    const updated = items
      .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
      .filter((i) => i.quantity > 0);
    setItems(updated);
    saveCart(updated);
  };

  const remove = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    saveCart(updated);
  };

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const checkout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">Tu carrito está vacío</p>
        <Link href="/" className="text-emerald-600 hover:underline">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            {item.image && (
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-emerald-600">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.id, -1)}
                className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300"
              >
                −
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQty(item.id, 1)}
                className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300"
              >
                +
              </button>
            </div>
            <p className="font-bold w-24 text-right">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <button onClick={() => remove(item.id)} className="text-red-500 hover:text-red-700">
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white rounded-lg shadow p-6 flex items-center justify-between">
        <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
        <button
          onClick={checkout}
          disabled={loading}
          className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition font-semibold"
        >
          {loading ? "Procesando..." : "Pagar con Stripe"}
        </button>
      </div>
    </div>
  );
}
