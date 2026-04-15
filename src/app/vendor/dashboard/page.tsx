"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Store, Package, DollarSign, TrendingUp, ArrowRight, Plus, BarChart3, CreditCard } from "lucide-react";

export default function VendorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/vendors").then((r) => r.json()).then((data) => {
      const list = Array.isArray(data) ? data : data.vendors || [];
      const myVendor = list.find((v: any) => v.userId === (session.user as any).id);
      setVendor(myVendor || null);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [session]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Store className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">No tienes una tienda</h1>
        <p className="text-muted-foreground mb-6">Registra tu tienda para empezar a vender en NovaTech</p>
        <Link href="/vendor/register"><Button size="lg" className="gap-2"><Plus className="h-4 w-4" />Registrar Tienda</Button></Link>
      </div>
    );
  }

  const statusMap: Record<string, { label: string; variant: any }> = {
    pending: { label: "En Revisión", variant: "warning" },
    approved: { label: "Aprobado", variant: "success" },
    suspended: { label: "Suspendido", variant: "destructive" },
  };
  const st = statusMap[vendor.status] || statusMap.pending;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">{vendor.storeName} <Badge variant={st.variant}>{st.label}</Badge></h1>
          <p className="text-muted-foreground mt-1">Panel de vendedor · Plan {vendor.subscriptionTier}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: DollarSign, label: "Ingresos", value: formatPrice(vendor.totalRevenue), color: "text-green-500", bg: "bg-green-500/10" },
          { icon: TrendingUp, label: "Ventas", value: vendor.totalSales, color: "text-blue-500", bg: "bg-blue-500/10" },
          { icon: Package, label: "Productos", value: vendor._count?.products || 0, color: "text-purple-500", bg: "bg-purple-500/10" },
          { icon: CreditCard, label: "Comisión", value: `${vendor.commissionRate}%`, color: "text-orange-500", bg: "bg-orange-500/10" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3"><span className="text-sm text-muted-foreground">{label}</span><div className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center`}><Icon className={`h-5 w-5 ${color}`} /></div></div>
              <p className="text-3xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: Package, label: "Mis Productos", desc: "Gestiona tu catálogo", href: "/vendor/products" },
          { icon: BarChart3, label: "Analytics", desc: "Métricas de tu tienda", href: "/vendor/analytics" },
          { icon: CreditCard, label: "Pagos", desc: "Historial de pagos", href: "/vendor/payouts" },
        ].map(({ icon: Icon, label, desc, href }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Icon className="h-6 w-6 text-primary" /></div>
                <div className="flex-1"><p className="font-semibold">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
