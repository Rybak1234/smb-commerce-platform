import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Percent } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Cupones</h1><p className="text-sm text-muted-foreground mt-1">Gestiona códigos de descuento</p></div>

      {coupons.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><Percent className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" /><p className="text-muted-foreground">No hay cupones</p></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <code className="text-lg font-bold text-primary">{c.code}</code>
                  <Badge variant={c.active ? "success" : "secondary"}>{c.active ? "Activo" : "Inactivo"}</Badge>
                </div>
                <div className="text-2xl font-bold">{c.type === "percentage" ? `${c.discount}%` : formatPrice(c.discount)}</div>
                {c.description && <p className="text-sm text-muted-foreground">{c.description}</p>}
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>Usos: {c.usedCount}{c.maxUses ? `/${c.maxUses}` : ""}</div>
                  {c.minAmount && <div>Mín: {formatPrice(c.minAmount)}</div>}
                  {c.maxDiscount && <div>Máx desc: {formatPrice(c.maxDiscount)}</div>}
                  {c.expiresAt && <div>Expira: {formatDate(c.expiresAt.toISOString())}</div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
