"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function VendorRegister() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName: fd.get("storeName"),
          description: fd.get("description"),
          phone: fd.get("phone"),
          email: fd.get("email"),
          address: fd.get("address"),
        }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Error"); }
      toast.success("¡Solicitud enviada! Te notificaremos cuando sea aprobada.");
      router.push("/vendor/dashboard");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center"><Store className="h-7 w-7 text-primary" /></div>
          <CardTitle className="text-2xl">Vende en SurtiBolivia</CardTitle>
          <CardDescription>Registra tu tienda y empieza a vender a miles de clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div><Label htmlFor="storeName">Nombre de la Tienda *</Label><Input id="storeName" name="storeName" required placeholder="Mi Tienda Increíble" /></div>
            <div><Label htmlFor="description">Descripción</Label><textarea id="description" name="description" rows={3} placeholder="Describe lo que vendes..." className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="phone">Teléfono</Label><Input id="phone" name="phone" placeholder="+591 7XXXXXXX" /></div>
              <div><Label htmlFor="email">Email de contacto</Label><Input id="email" name="email" type="email" placeholder="tienda@email.com" /></div>
            </div>
            <div><Label htmlFor="address">Dirección</Label><Input id="address" name="address" placeholder="Calle, Ciudad" /></div>
            <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Plan Gratuito incluye:</p>
              <ul className="space-y-1 list-disc list-inside"><li>Hasta 50 productos</li><li>10% de comisión por venta</li><li>Soporte por email</li><li>Panel de vendedor</li></ul>
            </div>
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? "Enviando..." : <><ArrowRight className="h-4 w-4" />Registrar Tienda</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
