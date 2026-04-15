"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface WishlistItem {
  id: string;
  product: { id: string; name: string; price: number; originalPrice?: number | null; image?: string | null; stock: number; category?: { name: string } | null };
}

export default function WishlistPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) { const data = await res.json(); setItems(data); }
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { if (session) fetchWishlist(); else setLoading(false); }, [session]);

  const removeItem = async (productId: string) => {
    try {
      await fetch("/api/wishlist", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId }) });
      setItems(items.filter((i) => i.product.id !== productId));
      toast.success("Eliminado de favoritos");
    } catch { toast.error("Error"); }
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"><Heart className="h-10 w-10 text-muted-foreground/30" /></div>
        <p className="text-lg font-medium">Inicia sesión para ver tus favoritos</p>
        <Link href="/login"><Button className="mt-4">Iniciar Sesión</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2"><Heart className="h-7 w-7 text-primary" /> Mi Lista de Deseos</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map((i) => (<div key={i} className="h-72 rounded-xl bg-muted animate-pulse" />))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"><Heart className="h-10 w-10 text-muted-foreground/30" /></div>
          <p className="text-lg font-medium">Tu lista de deseos está vacía</p>
          <p className="text-sm text-muted-foreground mt-1">Guarda productos que te gusten</p>
          <Link href="/"><Button className="mt-4 gap-2"><ShoppingBag className="h-4 w-4" /> Ir a la Tienda</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div key={item.id} className="group bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition-all">
              <div className="relative h-48 bg-muted">
                {item.product.image ? (
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="flex items-center justify-center h-full"><ShoppingBag className="h-10 w-10 text-muted-foreground/20" /></div>
                )}
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 rounded-full text-destructive hover:text-destructive" onClick={() => removeItem(item.product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                {item.product.category && <p className="text-[10px] uppercase text-muted-foreground">{item.product.category.name}</p>}
                <Link href={`/products/${item.product.id}`}><h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">{item.product.name}</h3></Link>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-primary font-bold">{formatPrice(item.product.price)}</span>
                  {item.product.originalPrice && <span className="text-xs text-muted-foreground line-through">{formatPrice(item.product.originalPrice)}</span>}
                </div>
                <p className="text-xs mt-1 font-medium">{item.product.stock > 0 ? <span className="text-green-600">En stock</span> : <span className="text-destructive">Agotado</span>}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

