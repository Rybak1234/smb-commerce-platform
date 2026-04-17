"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const save = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
    window.dispatchEvent(new Event("storage"));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return remove(id);
    save(items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  };

  const remove = (id: string) => {
    save(items.filter((i) => i.id !== id));
    toast.success("Producto eliminado del carrito");
  };

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const res = await fetch("/api/coupons/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: coupon, total: subtotal }) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Cupón inválido"); return; }
      setDiscount(data.discount);
      toast.success(`Cupón aplicado: -${formatPrice(data.discount)}`);
    } catch { toast.error("Error al validar cupón"); }
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 200 ? 0 : 25;
  const total = subtotal - discount + shipping;
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <p className="text-lg font-medium">Tu carrito está vacío</p>
          <p className="text-sm text-muted-foreground mt-1">Agrega productos para comenzar</p>
          <Link href="/"><Button className="mt-4 gap-2"><ShoppingBag className="h-4 w-4" /> Ir a la Tienda</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-xl border bg-card">
                <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                  <Image src={item.image || "/placeholder.png"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.id}`} className="font-semibold hover:text-primary transition-colors line-clamp-1">{item.name}</Link>
                  <p className="text-primary font-bold mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-lg">Resumen</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input placeholder="Código de cupón" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                  <Button variant="outline" onClick={applyCoupon}><Tag className="h-4 w-4" /></Button>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({itemCount} items)</span><span>{formatPrice(subtotal)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-green-600"><span>Descuento</span><span>-{formatPrice(discount)}</span></div>}
                  <div className="flex justify-between"><span className="text-muted-foreground">Envío</span><span className={shipping === 0 ? "text-green-600" : ""}>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</span></div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
                </div>
                <Button className="w-full gap-2" size="lg" onClick={() => toast.info("Pasarela de pago en desarrollo. Proximamente disponible.")}>Pagar<ArrowRight className="h-4 w-4" /></Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 p-2 rounded-lg border"><Truck className="h-3.5 w-3.5 text-primary" />Envío gratis en pedidos +Bs. 200</div>
              <div className="flex items-center gap-2 p-2 rounded-lg border"><ShieldCheck className="h-3.5 w-3.5 text-primary" />Pago seguro con Stripe</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

