"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, Heart, MapPin, Bell, Star, Settings, Gift, TrendingUp, ArrowRight, ShoppingBag, CreditCard, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatPrice, formatDate, getInitials } from "@/lib/utils";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0, loyaltyPoints: 0, wishlistCount: 0 });

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/orders?limit=5").then((r) => r.json()).then((d) => {
      const list = d.orders || d || [];
      setOrders(Array.isArray(list) ? list.slice(0, 5) : []);
      const total = Array.isArray(list) ? list.reduce((s: number, o: any) => s + (o.total || 0), 0) : 0;
      setStats((p) => ({ ...p, totalOrders: Array.isArray(list) ? list.length : 0, totalSpent: total }));
    }).catch(() => {});
    fetch("/api/wishlist").then((r) => r.json()).then((d) => setStats((p) => ({ ...p, wishlistCount: Array.isArray(d) ? d.length : 0 }))).catch(() => {});
  }, [session]);

  if (status === "loading") return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!session) return null;

  const user = session.user as any;
  const statusMap: Record<string, string> = { pending: "Pendiente", confirmed: "Confirmado", processing: "En Proceso", shipped: "Enviado", delivered: "Entregado", cancelled: "Cancelado" };
  const statusColor: Record<string, string> = { pending: "warning", confirmed: "info", processing: "info", shipped: "default", delivered: "success", cancelled: "destructive" } as any;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-xl bg-primary text-primary-foreground">{getInitials(user.name || user.email)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user.name || "Usuario"}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          {user.role && <Badge variant="outline" className="mt-1 capitalize">{user.role}</Badge>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Package, label: "Pedidos", value: stats.totalOrders },
          { icon: CreditCard, label: "Total Gastado", value: formatPrice(stats.totalSpent) },
          { icon: Star, label: "Puntos de Lealtad", value: stats.loyaltyPoints },
          { icon: Heart, label: "Favoritos", value: stats.wishlistCount },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Icon className="h-5 w-5 text-primary" /></div>
              <div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Links */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Mi Cuenta</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {[
              { icon: Package, label: "Mis Pedidos", href: "/account/orders" },
              { icon: Heart, label: "Lista de Deseos", href: "/wishlist" },
              { icon: MapPin, label: "Direcciones", href: "/account/addresses" },
              { icon: Bell, label: "Notificaciones", href: "/account/notifications" },
              { icon: Settings, label: "Configuración", href: "/account/settings" },
              ...(user.role === "vendor" ? [{ icon: TrendingUp, label: "Panel de Vendedor", href: "/vendor/dashboard" }] : []),
              ...(user.role === "admin" ? [{ icon: Settings, label: "Panel de Admin", href: "/admin" }] : []),
            ].map(({ icon: Icon, label, href }) => (
              <Link key={href} href={href} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group">
                <div className="flex items-center gap-3"><Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" /><span className="text-sm font-medium">{label}</span></div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Pedidos Recientes</CardTitle>
              <Link href="/account/orders"><Button variant="ghost" size="sm" className="gap-1">Ver todos <ArrowRight className="h-3 w-3" /></Button></Link>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Sin pedidos todavía</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <Link key={order.id} href={`/account/orders/${order.id}`} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><Package className="h-5 w-5 text-muted-foreground" /></div>
                        <div>
                          <p className="text-sm font-medium">#{order.orderNumber?.slice(0, 8) || order.id.slice(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={(statusColor[order.status] || "default") as any}>{statusMap[order.status] || order.status}</Badge>
                        <p className="text-sm font-semibold mt-1">{formatPrice(order.total)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

