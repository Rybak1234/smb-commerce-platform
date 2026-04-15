"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import CouponInput from "@/components/CouponInput";

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
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");

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
    if (item) toast.success(`${item.name} eliminado`);
  };

  const clearCart = () => {
    setItems([]);
    saveCart([]);
    setCouponDiscount(0);
    setCouponCode("");
    toast.success("Carrito vaciado");
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountAmount = subtotal * (couponDiscount / 100);
  const total = subtotal - discountAmount;
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  const handleCouponApply = (discount: number, code: string) => {
    setCouponDiscount(discount);
    setCouponCode(code);
  };

  const checkout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, couponCode, couponDiscount }),
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
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg font-medium mb-2">Tu carrito esta vacio</p>
        <p className="text-gray-400 text-sm mb-6">Agrega productos desde nuestra tienda</p>
        <Link href="/" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-medium text-sm">
          Explorar tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carrito de Compras</h1>
          <p className="text-sm text-gray-500 mt-1">{totalItems} articulo{totalItems !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 transition font-medium">
          Vaciar carrito
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border p-4 flex items-center gap-4 hover:shadow-sm transition">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item.name}</h3>
                <p className="text-indigo-600 font-medium text-sm">Bs. {item.price.toFixed(2)} c/u</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition text-sm font-bold">-</button>
                <span className="w-10 text-center font-medium">{item.quantity}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition text-sm font-bold">+</button>
              </div>
              <p className="font-bold w-24 text-right text-lg">Bs. {(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => remove(item.id)} className="text-gray-400 hover:text-red-500 transition p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border p-6 sticky top-20 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Resumen del pedido</h2>
            <div className="mb-4">
              <CouponInput subtotal={subtotal} onApply={handleCouponApply} />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} articulos)</span>
                <span>Bs. {subtotal.toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento ({couponDiscount}%)</span>
                  <span>-Bs. {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Envio</span>
                <span className="text-indigo-600 font-medium">{subtotal >= 200 ? "Gratis" : "Bs. 20.00"}</span>
              </div>
              {subtotal < 200 && (
                <p className="text-xs text-gray-400 bg-indigo-50 p-2 rounded-lg">
                  Agrega Bs. {(200 - subtotal).toFixed(2)} mas para envio gratis
                </p>
              )}
              <hr className="my-3" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-indigo-600">Bs. {(total + (subtotal < 200 ? 20 : 0)).toFixed(2)}</span>
              </div>
            </div>
            <button onClick={checkout} disabled={loading} className="mt-6 w-full bg-indigo-600 text-white py-3.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Procesando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pagar con Stripe
                </>
              )}
            </button>
            <Link href="/" className="block text-center text-sm text-indigo-600 hover:underline mt-3 font-medium">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}