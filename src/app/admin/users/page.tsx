import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-500 mt-1">{users.length} usuarios registrados</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-5 py-3 text-left">Usuario</th>
              <th className="px-5 py-3 text-left">Email</th>
              <th className="px-5 py-3 text-center">Rol</th>
              <th className="px-5 py-3 text-center">Órdenes</th>
              <th className="px-5 py-3 text-right">Registrado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${user.role === "admin" ? "bg-amber-500" : "bg-indigo-500"}`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-600">{user.email}</td>
                <td className="px-5 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {user.role === "admin" ? "Admin" : "Cliente"}
                  </span>
                </td>
                <td className="px-5 py-3 text-center font-semibold">{user._count.orders}</td>
                <td className="px-5 py-3 text-right text-gray-500">{new Date(user.createdAt).toLocaleDateString("es-MX")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
