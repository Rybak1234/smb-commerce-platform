import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const userId = (session.user as any).id;

  const [user, orders] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } } },
    }),
  ]);

  if (!user) return null;

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Cuenta</h1>
        <p className="text-gray-500 mt-1">Gestiona tu perfil y revisa tus pedidos</p>
      </div>

      {/* Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          <p className="text-xs text-gray-500">Pedidos Realizados</p>
        </div>
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">Bs. {totalSpent.toLocaleString("es-BO", { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-500">Total Gastado</p>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-5 border-b">
          <h2 className="font-semibold text-gray-900">Historial de Pedidos</h2>
        </div>
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-4xl mb-3">🛒</p>
            <p>Aún no has realizado ningún pedido</p>
          </div>
        ) : (
          <div className="divide-y">
            {orders.map((order) => (
              <div key={order.id} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-mono text-xs text-gray-400">#{order.id.slice(-8)}</span>
                    <span className="mx-2 text-gray-300">·</span>
                    <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.status === "paid" ? "bg-green-100 text-green-700" :
                      order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                      order.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.status === "paid" ? "Pagada" : order.status === "shipped" ? "Enviada" : order.status === "cancelled" ? "Cancelada" : "Pendiente"}
                    </span>
                    <span className="font-semibold">Bs. {order.total.toLocaleString("es-BO", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-sm text-gray-600">
                      {item.product.image && (
                        <img src={item.product.image} alt="" className="w-10 h-10 rounded object-cover" />
                      )}
                      <span className="flex-1">{item.product.name}</span>
                      <span className="text-gray-400">x{item.quantity}</span>
                      <span className="font-medium">Bs. {(item.price * item.quantity).toLocaleString("es-BO", { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
