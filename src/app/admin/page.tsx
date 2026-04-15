import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingBag, Package, Users, TrendingUp, AlertTriangle, Store, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [orderCount, productCount, userCount, vendorCount, recentOrders, lowStock, totalRevenue, pendingOrders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.user.count(),
    prisma.vendor.count({ where: { status: "approved" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
    prisma.product.findMany({ where: { active: true, stock: { lte: 5 } }, orderBy: { stock: "asc" }, take: 5 }),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "paid" } }),
    prisma.order.count({ where: { status: "pending" } }),
  ]);

  const revenue = totalRevenue._sum.total || 0;
  const statusMap: Record<string, string> = { pending: "Pendiente", confirmed: "Confirmado", processing: "En Proceso", shipped: "Enviado", delivered: "Entregado", cancelled: "Cancelado" };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Resumen general de tu marketplace</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: "Ingresos Totales", value: formatPrice(revenue), color: "text-green-500", bg: "bg-green-500/10" },
          { icon: ShoppingBag, label: "Total Pedidos", value: orderCount, color: "text-blue-500", bg: "bg-blue-500/10", extra: `${pendingOrders} pendientes` },
          { icon: Package, label: "Productos Activos", value: productCount, color: "text-purple-500", bg: "bg-purple-500/10" },
          { icon: Users, label: "Usuarios", value: userCount, color: "text-orange-500", bg: "bg-orange-500/10", extra: `${vendorCount} vendedores` },
        ].map(({ icon: Icon, label, value, color, bg, extra }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                <div className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center`}><Icon className={`h-5 w-5 ${color}`} /></div>
              </div>
              <p className="text-3xl font-bold">{value}</p>
              {extra && <p className="text-xs text-muted-foreground mt-1">{extra}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Pedidos Recientes</CardTitle>
            <Link href="/admin/orders" className="text-xs text-primary hover:underline flex items-center gap-1">Ver todos <ArrowUpRight className="h-3 w-3" /></Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">Sin pedidos</p> : (
              <div className="space-y-3">
                {recentOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">#{o.orderNumber?.slice(0, 8) || o.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{o.customerName || o.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">{statusMap[o.status] || o.status}</Badge>
                      <p className="text-sm font-semibold mt-1">{formatPrice(o.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-orange-500" />Stock Bajo</CardTitle>
            <Link href="/admin/products" className="text-xs text-primary hover:underline flex items-center gap-1">Ver todos <ArrowUpRight className="h-3 w-3" /></Link>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">Sin alertas de stock</p> : (
              <div className="space-y-3">
                {lowStock.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(p.price)}</p>
                    </div>
                    <Badge variant={p.stock === 0 ? "destructive" : "warning"}>{p.stock === 0 ? "Agotado" : `${p.stock} uds`}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

