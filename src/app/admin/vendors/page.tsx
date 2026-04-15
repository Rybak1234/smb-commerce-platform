import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, CheckCircle, XCircle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminVendorsPage() {
  const vendors = await prisma.vendor.findMany({
    include: { user: { select: { name: true, email: true } }, _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });

  const statusMap: Record<string, { label: string; variant: any; icon: any }> = {
    pending: { label: "Pendiente", variant: "warning", icon: Clock },
    approved: { label: "Aprobado", variant: "success", icon: CheckCircle },
    suspended: { label: "Suspendido", variant: "destructive", icon: XCircle },
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Vendedores</h1><p className="text-sm text-muted-foreground mt-1">Gestiona los vendedores del marketplace</p></div>

      {vendors.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><Store className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" /><p className="text-muted-foreground">No hay vendedores registrados</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {vendors.map((v) => {
            const status = statusMap[v.status] || statusMap.pending;
            return (
              <Card key={v.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"><Store className="h-6 w-6 text-primary" /></div>
                      <div>
                        <p className="font-semibold">{v.storeName}</p>
                        <p className="text-xs text-muted-foreground">{v.user.name} · {v.user.email}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{v._count.products} productos</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">Comisión: {v.commissionRate}%</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground capitalize">Plan: {v.subscriptionTier}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <p className="text-sm font-semibold">{formatPrice(v.totalRevenue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
