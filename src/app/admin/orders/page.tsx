import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";

export const dynamic = "force-dynamic";

const statusMap: Record<string, { label: string; variant: any }> = {
  pending: { label: "Pendiente", variant: "warning" },
  confirmed: { label: "Confirmado", variant: "info" },
  processing: { label: "Procesando", variant: "info" },
  shipped: { label: "Enviado", variant: "default" },
  delivered: { label: "Entregado", variant: "success" },
  cancelled: { label: "Cancelado", variant: "destructive" },
  refunded: { label: "Reembolsado", variant: "destructive" },
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  const revenue = orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0);
  const kpis = [
    { label: "Pendientes", count: orders.filter((o) => o.status === "pending").length, cls: "bg-orange-500/10 text-orange-600" },
    { label: "Procesando", count: orders.filter((o) => o.status === "processing").length, cls: "bg-blue-500/10 text-blue-600" },
    { label: "Enviados", count: orders.filter((o) => o.status === "shipped").length, cls: "bg-sky-500/10 text-sky-600" },
    { label: "Entregados", count: orders.filter((o) => o.status === "delivered").length, cls: "bg-green-500/10 text-green-600" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Órdenes</h1>
        <p className="text-sm text-muted-foreground mt-1">{orders.length} órdenes · Ingresos: {formatPrice(revenue)}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <div key={k.label} className={`${k.cls} rounded-xl p-4 text-center`}>
            <div className="text-2xl font-bold">{k.count}</div>
            <div className="text-xs font-medium mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Nº Orden</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Cliente</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Estado</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Pago</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Productos</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((o) => {
              const st = statusMap[o.status] || statusMap.pending;
              return (
                <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{o.orderNumber}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{o.user?.name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{o.user?.email}</div>
                  </td>
                  <td className="px-4 py-3"><Badge variant={st.variant}>{st.label}</Badge></td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${o.paymentStatus === "paid" ? "bg-green-500/10 text-green-600" : o.paymentStatus === "failed" ? "bg-red-500/10 text-red-600" : "bg-muted text-muted-foreground"}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                    {o.items.map((i: any) => `${i.product?.name || "?"} ×${i.quantity}`).join(", ")}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(o.createdAt)}</td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <p>No hay órdenes aún</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
