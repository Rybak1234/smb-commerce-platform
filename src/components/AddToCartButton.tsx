"use client";

import { useState } from "react";

interface Props {
  product: { id: string; name: string; price: number; image?: string | null };
}

export default function AddToCartButton({ product }: Props) {
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    const raw = localStorage.getItem("cart");
    const cart = raw ? JSON.parse(raw) : [];
    const idx = cart.findIndex((i: { id: string }) => i.id === product.id);
    if (idx >= 0) {
      cart[idx].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      onClick={addToCart}
      className={`mt-3 w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        added
          ? "bg-green-500 text-white scale-95"
          : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md active:scale-95"
      }`}
    >
      {added ? "✓ Agregado" : "Agregar al carrito"}
    </button>
  );
}
