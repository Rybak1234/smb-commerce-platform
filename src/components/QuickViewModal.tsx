"use client";

import { useEffect, useState, useCallback } from "react";
import { ProductImage } from "./ProductImage";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, Heart, ChevronLeft, ChevronRight, Minus, Plus, Store, Share2 } from "lucide-react";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  description?: string;
  image?: string | null;
  images?: string[];
  stock: number;
  avgRating: number;
  reviewCount: number;
  brand?: string | null;
  badge?: string | null;
  vendor?: { storeName: string } | null;
  category?: { name: string } | null;
}

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickViewModal({ product, open, onOpenChange }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setQuantity(1);
    setActiveImage(0);
  }, [product]);

  if (!product) return null;

  const allImages = [product.image, ...(product.images || [])].filter(Boolean) as string[];
  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0;

  const handleAddToCart = () => {
    toast.success(`${product.name} añadido al carrito`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="relative aspect-square bg-muted">
              <ProductImage src={allImages[activeImage]} alt={product.name} fill className="object-cover" />
            {discount > 0 && (
              <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-500">-{discount}%</Badge>
            )}
            {product.badge && (
              <Badge className="absolute top-3 right-3" variant="secondary">{product.badge}</Badge>
            )}
            {allImages.length > 1 && (
              <>
                <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full h-8 w-8" onClick={() => setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full h-8 w-8" onClick={() => setActiveImage((prev) => (prev + 1) % allImages.length)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            {allImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {allImages.map((_, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} className={`h-2 w-2 rounded-full transition-colors ${i === activeImage ? "bg-primary" : "bg-white/60"}`} />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col">
            {product.category && <p className="text-xs font-medium text-primary uppercase">{product.category.name}</p>}
            <h2 className="text-xl font-bold mt-1">{product.name}</h2>

            {product.vendor && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Store className="h-3 w-3" /> {product.vendor.storeName}
              </div>
            )}

            <div className="flex items-center gap-2 mt-2">
              <div className="flex">{[1,2,3,4,5].map((s) => (<Star key={s} className={`h-4 w-4 ${s <= Math.round(product.avgRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />))}</div>
              <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
            </div>

            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{product.description}</p>
            )}

            <Separator className="my-4" />

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Stock:</span>
              {product.stock > 0 ? (
                <Badge variant="success">{product.stock} disponibles</Badge>
              ) : (
                <Badge variant="destructive">Agotado</Badge>
              )}
            </div>

            {product.brand && (
              <div className="flex items-center gap-2 text-sm mt-2">
                <span className="text-muted-foreground">Marca:</span>
                <span className="font-medium">{product.brand}</span>
              </div>
            )}

            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center border rounded-lg">
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={product.stock === 0}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={product.stock === 0}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button className="flex-1 gap-2" disabled={product.stock === 0} onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4" /> Añadir al Carrito
              </Button>
              <Button variant="outline" size="icon" onClick={() => toast.success("Añadido a favoritos")}>
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(window.location.origin + "/products/" + product.id); toast.success("Enlace copiado"); }}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
