import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Store, User } from "lucide-react";

export const dynamic = "force-dynamic";

const roleConfig: Record<string, { label: string; variant: any; icon: any }> = {
  admin: { label: "Admin", variant: "warning", icon: Shield },
  vendor: { label: "Vendedor", variant: "info", icon: Store },
  customer: { label: "Cliente", variant: "secondary", icon: User },
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true, reviews: true } } },
  });

  const admins = users.filter((u) => u.role === "admin").length;
  const vendors = users.filter((u) => u.role === "vendor").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <p className="text-sm text-muted-foreground mt-1">{users.length} usuarios · {admins} admins · {vendors} vendedores</p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usuario</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Rol</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Órdenes</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Reseñas</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Puntos</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => {
              const rc = roleConfig[user.role] || roleConfig.customer;
              const Icon = rc.icon;
              return (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3 text-center"><Badge variant={rc.variant} className="gap-1"><Icon className="h-3 w-3" />{rc.label}</Badge></td>
                  <td className="px-4 py-3 text-center font-semibold">{user._count.orders}</td>
                  <td className="px-4 py-3 text-center">{user._count.reviews}</td>
                  <td className="px-4 py-3 text-center">{user.loyaltyPoints}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground text-xs">{formatDate(user.createdAt)}</td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" /><p>No hay usuarios</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
