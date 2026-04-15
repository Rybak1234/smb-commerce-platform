"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, ChevronLeft, ChevronRight, Eye } from "lucide-react";

const statusLabels: Record<string, { label: string; variant: any }> = {
  pending: { label: "Pendiente", variant: "warning" },
  confirmed: { label: "Confirmado", variant: "info" },
  processing: { label: "Procesando", variant: "info" },
  shipped: { label: "Enviado", variant: "default" },
  delivered: { label: "Entregado", variant: "success" },
  cancelled: { label: "Cancelado", variant: "destructive" },
  refunded: { label: "Reembolsado", variant: "destructive" },
};

export default function AccountOrders() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/login");
  }, [authStatus, router]);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    fetch(`/api/orders?page=${page}&limit=${limit}`)
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders || []);
        setTotal(data.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session, page]);

  const totalPages = Math.ceil(total / limit);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis Pedidos</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16"><Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" /><p className="text-muted-foreground mb-4">No tienes pedidos aún</p><Link href="/"><Button>Explorar Productos</Button></Link></div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => {
              const s = statusLabels[order.status] || statusLabels.pending;
              return (
                <Card key={order.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">#{order.orderNumber}</span>
                          <Badge variant={s.variant}>{s.label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                        <p className="text-sm">{order.items?.length || 0} artículo(s)</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold">{formatPrice(order.total)}</p>
                        <Link href={`/account/orders/${order.id}`}><Button variant="outline" size="sm" className="gap-1"><Eye className="h-3.5 w-3.5" />Ver</Button></Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="text-sm">Página {page} de {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
