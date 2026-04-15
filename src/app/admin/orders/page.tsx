import { prisma } from "@/lib/prisma";
import Link from "next/link";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  const revenue = orders.filter((o) => o.status === "paid" || o.status === "shipped").reduce((s, o) => s + o.total, 0);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Órdenes</h1>
        <p className="text-sm text-gray-500 mt-1">
          {orders.length} orden{orders.length !== 1 ? "es" : ""} · Ingresos: Bs. {revenue.toFixed(2)}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Pendientes", count: orders.filter((o) => o.status === "pending").length, color: "bg-yellow-50 text-yellow-700" },
          { label: "Pagadas", count: orders.filter((o) => o.status === "paid").length, color: "bg-green-50 text-green-700" },
          { label: "Enviadas", count: orders.filter((o) => o.status === "shipped").length, color: "bg-blue-50 text-blue-700" },
          { label: "Canceladas", count: orders.filter((o) => o.status === "cancelled").length, color: "bg-red-50 text-red-700" },
        ].map((kpi) => (
          <div key={kpi.label} className={`${kpi.color} rounded-xl p-4 text-center`}>
            <div className="text-2xl font-bold">{kpi.count}</div>
            <div className="text-xs font-medium mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Cliente</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Estado</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Total</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Productos</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.id.slice(0, 8)}…</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{o.customerName}</div>
                  <div className="text-xs text-gray-400">{o.customerEmail}</div>
                </td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={o.id} currentStatus={o.status} />
                </td>
                <td className="px-4 py-3 text-right font-semibold">Bs. {o.total.toFixed(2)}</td>
                <td className="px-4 py-3 text-xs text-gray-500 max-w-[200px] truncate">
                  {o.items.map((i) => `${i.product.name} ×${i.quantity}`).join(", ")}
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {new Date(o.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  <div className="text-3xl mb-2">📋</div>
                  No hay órdenes aún
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
