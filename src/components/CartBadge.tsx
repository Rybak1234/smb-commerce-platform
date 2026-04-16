"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      const raw = localStorage.getItem("cart");
      const cart = raw ? JSON.parse(raw) : [];
      setCount(cart.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0));
    };
    update();
    window.addEventListener("cart-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cart-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <Link href="/cart" className="relative hover:text-primary transition-colors">
      <ShoppingCart className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold animate-scale-in">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
