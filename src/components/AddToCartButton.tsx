"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import toast from "react-hot-toast";

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
    toast.success(`${product.name} agregado al carrito`);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      onClick={addToCart}
      className={`mt-3 w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
        added
          ? "bg-green-500 text-white scale-95"
          : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md active:scale-95"
      }`}
    >
      {added ? <><Check className="h-4 w-4" /> Agregado</> : <><ShoppingCart className="h-4 w-4" /> Agregar al carrito</>}
    </button>
  );
}
