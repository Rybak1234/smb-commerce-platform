"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

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
  window.dispatchEvent(new Event("cart-updated"));
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
    const item = items.find((i) => i.id === id);
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    saveCart(updated);
    if (item) toast.success(`${item.name} eliminado`, { icon: '🗑️' });
  };

  const clearCart = () => {
    setItems([]);
    saveCart([]);
    toast.success('Carrito vaciado', { icon: '🛒' });
  };

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

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
      toast.error("Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-gray-400 text-lg mb-2">Tu carrito está vacío</p>
        <p className="text-gray-300 text-sm mb-6">Agrega productos desde nuestra tienda</p>
        <Link href="/" className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium text-sm">
          Explorar tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Carrito de Compras</h1>
          <p className="text-sm text-gray-500 mt-1">{totalItems} artículo{totalItems !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 transition">
          Vaciar carrito
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border p-4 flex items-center gap-4 hover:shadow-sm transition">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-gray-50 flex items-center justify-center text-2xl">📦</div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item.name}</h3>
                <p className="text-indigo-600 font-medium text-sm">Bs. {item.price.toFixed(2)} c/u</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateQty(item.id, -1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition text-sm font-bold"
                >
                  −
                </button>
                <span className="w-10 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQty(item.id, 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition text-sm font-bold"
                >
                  +
                </button>
              </div>
              <p className="font-bold w-24 text-right text-lg">
                Bs. {(item.price * item.quantity).toFixed(2)}
              </p>
              <button onClick={() => remove(item.id)} className="text-gray-400 hover:text-red-500 transition p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border p-6 sticky top-20">
            <h2 className="font-bold text-lg mb-4">Resumen del pedido</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} artículos)</span>
                <span>Bs. {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="text-indigo-600 font-medium">Gratis</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-indigo-600">Bs. {total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={checkout}
              disabled={loading}
              className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Procesando...
                </>
              ) : (
                "Pagar con Stripe"
              )}
            </button>
            <Link href="/" className="block text-center text-sm text-indigo-600 hover:underline mt-3">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
