"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { BarChart3, TrendingUp, Package, Users, ShoppingBag, DollarSign } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics").then((r) => r.json()).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!data) return <p className="text-center text-muted-foreground py-20">Error al cargar analytics</p>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Analytics</h1><p className="text-sm text-muted-foreground mt-1">Métricas detalladas de tu marketplace</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: "Ingresos", value: formatPrice(data.revenue || 0), color: "text-green-500", bg: "bg-green-500/10" },
          { icon: ShoppingBag, label: "Pedidos", value: data.orders || 0, color: "text-blue-500", bg: "bg-blue-500/10" },
          { icon: Package, label: "Productos", value: data.products || 0, color: "text-purple-500", bg: "bg-purple-500/10" },
          { icon: Users, label: "Usuarios", value: data.users || 0, color: "text-orange-500", bg: "bg-orange-500/10" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label}><CardContent className="p-6">
            <div className="flex items-center justify-between mb-3"><span className="text-sm text-muted-foreground">{label}</span><div className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center`}><Icon className={`h-5 w-5 ${color}`} /></div></div>
            <p className="text-3xl font-bold">{value}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Top Productos</CardTitle></CardHeader>
          <CardContent>
            {data.topProducts?.length ? (
              <div className="space-y-3">
                {data.topProducts.map((p: any, i: number) => (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded-lg border">
                    <div className="flex items-center gap-2"><span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span><span className="text-sm font-medium line-clamp-1">{p.name}</span></div>
                    <span className="text-sm font-semibold">{p.salesCount} ventas</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-4">Sin datos</p>}
          </CardContent>
        </Card>

        {/* Revenue Chart (text-based) */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Ingresos por Día (Últimos 7 días)</CardTitle></CardHeader>
          <CardContent>
            {data.revenueChart?.length ? (
              <div className="space-y-2">
                {data.revenueChart.map((day: any) => {
                  const maxRev = Math.max(...data.revenueChart.map((d: any) => d.revenue || 0), 1);
                  const pct = ((day.revenue || 0) / maxRev) * 100;
                  return (
                    <div key={day.date} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-20 shrink-0">{day.date}</span>
                      <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                        <div className="h-full bg-primary rounded transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-medium w-20 text-right">{formatPrice(day.revenue || 0)}</span>
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-4">Sin datos de ingresos</p>}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{data.pendingRefunds || 0}</p><p className="text-xs text-muted-foreground">Reembolsos Pendientes</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{data.activeVendors || 0}</p><p className="text-xs text-muted-foreground">Vendedores Activos</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{formatPrice(data.avgOrderValue || 0)}</p><p className="text-xs text-muted-foreground">Ticket Promedio</p></CardContent></Card>
      </div>
    </div>
  );
}
