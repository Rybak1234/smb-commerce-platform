"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function WishlistButton({ productId, size = "sm" }: { productId: string; size?: "sm" | "md" }) {
  const { data: session } = useSession();
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch(`/api/wishlist?productId=${productId}`)
      .then((r) => r.json())
      .then((data) => setWishlisted(data.wishlisted))
      .catch(() => {});
  }, [session, productId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      toast.error("Inicia sesión para guardar favoritos");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      setWishlisted(data.wishlisted);
      toast.success(data.wishlisted ? "Agregado a favoritos" : "Eliminado de favoritos", { icon: data.wishlisted ? "❤️" : "💔" });
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch {
      toast.error("Error al actualizar favoritos");
    } finally {
      setLoading(false);
    }
  };

  const s = size === "md" ? "w-9 h-9" : "w-7 h-7";
  const iconS = size === "md" ? "w-5 h-5" : "w-4 h-4";

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`${s} rounded-full flex items-center justify-center transition-all duration-200 ${
        wishlisted
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-white/80 text-gray-400 hover:text-red-500 hover:bg-red-50"
      } backdrop-blur-sm shadow-sm border border-gray-100 disabled:opacity-50`}
      title={wishlisted ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className={iconS} viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>
  );
}
