"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/utils";
import { ArrowLeft, Package, MapPin, Truck } from "lucide-react";
import { OrderTrackingTimeline } from "@/components/OrderTrackingTimeline";

const statusLabels: Record<string, { label: string; variant: any }> = {
  pending: { label: "Pendiente", variant: "warning" },
  confirmed: { label: "Confirmado", variant: "info" },
  processing: { label: "Procesando", variant: "info" },
  shipped: { label: "Enviado", variant: "default" },
  delivered: { label: "Entregado", variant: "success" },
  cancelled: { label: "Cancelado", variant: "destructive" },
  refunded: { label: "Reembolsado", variant: "destructive" },
};

export default function OrderDetail({ params }: { params: { id: string } }) {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/login");
  }, [authStatus, router]);

  useEffect(() => {
    if (!session) return;
    fetch(`/api/orders/${params.id}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setOrder)
      .catch(() => router.push("/account/orders"))
      .finally(() => setLoading(false));
  }, [session, params.id, router]);

  if (loading || !order) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  const s = statusLabels[order.status] || statusLabels.pending;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="h-4 w-4" />Volver a pedidos</Link>

      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">Pedido #{order.orderNumber}</h1><p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p></div>
        <Badge variant={s.variant} className="text-sm">{s.label}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />Artículos</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-16 w-16 bg-muted rounded-md overflow-hidden shrink-0">
                    <ProductImage src={item.product?.images?.[0]} alt={item.product?.name || "Producto"} width={64} height={64} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product?.name || "Producto"}</p>
                    {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                    <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {order.status !== "cancelled" && order.status !== "refunded" && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5" />Seguimiento</CardTitle></CardHeader>
              <CardContent>
                <OrderTrackingTimeline currentStatus={order.status} trackingNumber={order.trackingNumber} trackingUrl={order.trackingUrl} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Resumen</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Descuento</span><span className="text-green-600">-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Envío</span><span>{order.shipping > 0 ? formatPrice(order.shipping) : "Gratis"}</span></div>
              {order.tax > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Impuesto</span><span>{formatPrice(order.tax)}</span></div>}
              <Separator />
              <div className="flex justify-between font-bold text-base"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </CardContent>
          </Card>

          {order.shippingAddress && (
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" />Dirección de Envío</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
