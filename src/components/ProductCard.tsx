"use client";
import Link from "next/link";
import { ProductImage } from "./ProductImage";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { cn, formatPrice, calculateDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug?: string;
    price: number;
    originalPrice?: number | null;
    image?: string | null;
    images?: string[] | null;
    badge?: string | null;
    avgRating?: number;
    reviewCount?: number;
    category?: { name: string } | null;
    vendor?: { storeName: string } | null;
    stock?: number;
  };
  onQuickView?: (id: string) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const productImage = product.image || product.images?.[0] || null;
  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist-ids") || "[]");
    if (saved.includes(product.id)) setWishlisted(true);
  }, [product.id]);

  async function toggleWishlist() {
    const next = !wishlisted;
    setWishlisted(next);
    // Persist locally
    const saved: string[] = JSON.parse(localStorage.getItem("wishlist-ids") || "[]");
    if (next) {
      if (!saved.includes(product.id)) saved.push(product.id);
    } else {
      const idx = saved.indexOf(product.id);
      if (idx >= 0) saved.splice(idx, 1);
    }
    localStorage.setItem("wishlist-ids", JSON.stringify(saved));
    // Try API (works if logged in)
    try {
      if (next) {
        await fetch("/api/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product.id }) });
      } else {
        await fetch("/api/wishlist", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product.id }) });
      }
    } catch {}
    toast.success(next ? "Agregado a favoritos" : "Eliminado de favoritos");
  }

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i: any) => i.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ id: product.id, name: product.name, price: product.price, image: productImage, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Agregado al carrito");
  }

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.badge && <Badge variant="default">{product.badge}</Badge>}
        {discount > 0 && <Badge variant="destructive">-{discount}%</Badge>}
        {product.stock === 0 && <Badge variant="secondary">Agotado</Badge>}
      </div>

      {/* Wishlist */}
      <button onClick={toggleWishlist} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all opacity-0 group-hover:opacity-100">
        <Heart className={cn("h-4 w-4", wishlisted && "fill-red-500 text-red-500")} />
      </button>

      {/* Image */}
      <Link href={`/products/${product.id}`} className="block aspect-square overflow-hidden bg-muted relative">
        <ProductImage src={productImage} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
        {/* Quick actions overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button size="sm" className="flex-1 shadow-lg" onClick={(e) => { e.preventDefault(); addToCart(); }} disabled={product.stock === 0}>
            <ShoppingCart className="h-4 w-4 mr-1" /> Agregar
          </Button>
          {onQuickView && (
            <Button size="sm" variant="secondary" className="shadow-lg" onClick={(e) => { e.preventDefault(); onQuickView(product.id); }}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 space-y-2">
        {product.vendor && <p className="text-xs text-muted-foreground">{product.vendor.storeName}</p>}
        {product.category && <p className="text-xs text-primary font-medium">{product.category.name}</p>}
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        {(product.avgRating ?? 0) > 0 && (
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{product.avgRating?.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Card>
  );
}
