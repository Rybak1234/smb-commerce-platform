import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, orders, users, recentOrders] = await Promise.all([
    prisma.product.aggregate({ _count: true, _sum: { stock: true } }),
    prisma.order.aggregate({ _count: true, _sum: { total: true } }),
    prisma.user.count(),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } } },
    }),
  ]);

  const [pending, paid, shipped, cancelled] = await Promise.all([
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { status: "paid" } }),
    prisma.order.count({ where: { status: "shipped" } }),
    prisma.order.count({ where: { status: "cancelled" } }),
  ]);

  const lowStock = await prisma.product.findMany({
    where: { stock: { lte: 5 }, active: true },
    orderBy: { stock: "asc" },
    take: 5,
  });

  const totalRevenue = orders._sum.total || 0;
  const totalOrders = orders._count;
  const totalProducts = products._count;
  const totalStock = products._sum.stock || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-500 mt-1">Resumen general de la tienda</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-lg">💰</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-gray-500">Ingresos Totales</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-lg">📦</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              <p className="text-xs text-gray-500">Órdenes Totales</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 text-lg">🛍️</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              <p className="text-xs text-gray-500">Productos ({totalStock} en stock)</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 text-lg">👥</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users}</p>
              <p className="text-xs text-gray-500">Usuarios Registrados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-white rounded-xl border p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Estado de Órdenes</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Pendientes</span>
              <span className="font-semibold text-yellow-600">{pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full bg-green-400" /> Pagadas</span>
              <span className="font-semibold text-green-600">{paid}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full bg-blue-400" /> Enviadas</span>
              <span className="font-semibold text-blue-600">{shipped}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full bg-red-400" /> Canceladas</span>
              <span className="font-semibold text-red-600">{cancelled}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-xl border p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="space-y-2">
            <Link href="/admin/products" className="block w-full text-left px-4 py-2.5 rounded-lg bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 transition text-sm font-medium">
              📋 Gestionar Productos
            </Link>
            <Link href="/admin/products/new" className="block w-full text-left px-4 py-2.5 rounded-lg bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 transition text-sm font-medium">
              ➕ Nuevo Producto
            </Link>
            <Link href="/admin/orders" className="block w-full text-left px-4 py-2.5 rounded-lg bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 transition text-sm font-medium">
              📦 Gestionar Órdenes
            </Link>
            <Link href="/admin/users" className="block w-full text-left px-4 py-2.5 rounded-lg bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 transition text-sm font-medium">
              👥 Ver Usuarios
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-xl border p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">⚠️ Stock Bajo</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-gray-400">Todos los productos tienen stock suficiente</p>
          ) : (
            <div className="space-y-2">
              {lowStock.map((p) => (
                <Link key={p.id} href={`/admin/products/${p.id}`} className="flex items-center justify-between px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition">
                  <span className="text-sm font-medium text-gray-700 truncate">{p.name}</span>
                  <span className="text-xs font-bold text-red-600 ml-2">{p.stock} uds</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Órdenes Recientes</h2>
          <Link href="/admin/orders" className="text-sm text-emerald-600 hover:underline">Ver todas →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">ID</th>
                <th className="px-5 py-3 text-left">Cliente</th>
                <th className="px-5 py-3 text-left">Items</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-center">Estado</th>
                <th className="px-5 py-3 text-right">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{order.id.slice(-8)}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-xs text-gray-400">{order.customerEmail}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{order.items.length} productos</td>
                  <td className="px-5 py-3 text-right font-semibold">${order.total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.status === "paid" ? "bg-green-100 text-green-700" :
                      order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                      order.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.status === "paid" ? "Pagada" : order.status === "shipped" ? "Enviada" : order.status === "cancelled" ? "Cancelada" : "Pendiente"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-gray-500">{new Date(order.createdAt).toLocaleDateString("es-MX")}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">No hay órdenes aún</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
