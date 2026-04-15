"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import StarRating from "@/components/StarRating";
import toast from "react-hot-toast";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice: number | null;
    image: string | null;
    category: string;
    badge: string | null;
    stock: number;
    reviews: { rating: number }[];
  };
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchWishlist();
    else setLoading(false);
  }, [session]);

  useEffect(() => {
    window.addEventListener("wishlist-updated", fetchWishlist);
    return () => window.removeEventListener("wishlist-updated", fetchWishlist);
  }, []);

  const removeItem = async (productId: string) => {
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
    toast.success("Eliminado de favoritos", { icon: "💔" });
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">❤️</div>
        <h1 className="text-2xl font-bold mb-2">Mis Favoritos</h1>
        <p className="text-gray-400 mb-6">Inicia sesión para ver tus productos favoritos</p>
        <Link href="/login" className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition font-medium text-sm">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">❤️</div>
        <h1 className="text-2xl font-bold mb-2">Mis Favoritos</h1>
        <p className="text-gray-400 mb-2">Aún no has agregado productos a favoritos</p>
        <p className="text-gray-300 text-sm mb-6">Explora la tienda y guarda los que te gusten</p>
        <Link href="/" className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition font-medium text-sm">
          Explorar tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Favoritos</h1>
        <p className="text-gray-500 mt-1">{items.length} producto{items.length !== 1 ? "s" : ""} guardado{items.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map(({ product }) => {
          const avg = product.reviews.length
            ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
            : 0;
          const discount = product.originalPrice
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;
          return (
            <div key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="relative">
                <Link href={`/products/${product.id}`} className="block overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-52 bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center text-5xl">📦</div>
                  )}
                </Link>
                {discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">-{discount}%</span>
                )}
                <button
                  onClick={() => removeItem(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition shadow-sm border border-red-100"
                  title="Quitar de favoritos"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={0}>
                    <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">{product.category}</p>
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
                </Link>
                {avg > 0 && <div className="mt-1.5"><StarRating rating={avg} count={product.reviews.length} /></div>}
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-indigo-600 font-bold text-lg">Bs. {product.price.toFixed(2)}</span>
                  {product.originalPrice && <span className="text-gray-400 text-xs line-through">Bs. {product.originalPrice.toFixed(2)}</span>}
                </div>
                <AddToCartButton product={product} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
