"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SuccessPage() {
  useEffect(() => {
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cart-updated"));
  }, []);

  return (
    <div className="text-center py-20 animate-fade-in">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-2">¡Pago exitoso!</h1>
      <p className="text-gray-500 mb-2 max-w-sm mx-auto">
        Tu orden ha sido procesada correctamente. Recibirás un correo de confirmación en breve.
      </p>
      <p className="text-sm text-gray-400 mb-8">Gracias por tu compra</p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/"
          className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition font-medium"
        >
          Seguir comprando
        </Link>
        <Link
          href="/admin/orders"
          className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
        >
          Ver órdenes
        </Link>
      </div>
    </div>
  );
}
