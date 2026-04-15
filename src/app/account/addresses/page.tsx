"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Trash2, Star, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AccountAddresses() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/login");
  }, [authStatus, router]);

  const fetchAddresses = () => {
    fetch("/api/addresses").then((r) => r.json()).then((data) => setAddresses(Array.isArray(data) ? data : [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { if (session) fetchAddresses(); }, [session]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: fd.get("phone"),
          line1: fd.get("line1"),
          line2: fd.get("line2"),
          city: fd.get("city"),
          state: fd.get("state"),
          zipCode: fd.get("zipCode"),
          country: fd.get("country") || "Bolivia",
          isDefault: fd.get("isDefault") === "on",
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Dirección guardada");
      setShowForm(false);
      fetchAddresses();
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAddress(id: string) {
    try {
      await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      toast.success("Dirección eliminada");
      fetchAddresses();
    } catch {
      toast.error("Error al eliminar");
    }
  }

  async function setDefault(id: string) {
    try {
      await fetch(`/api/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      toast.success("Dirección predeterminada actualizada");
      fetchAddresses();
    } catch {
      toast.error("Error al actualizar");
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mis Direcciones</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">{showForm ? <><X className="h-4 w-4" />Cancelar</> : <><Plus className="h-4 w-4" />Nueva Dirección</>}</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Nueva Dirección</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="name">Nombre completo *</Label><Input id="name" name="name" required /></div>
                <div><Label htmlFor="phone">Teléfono</Label><Input id="phone" name="phone" /></div>
              </div>
              <div><Label htmlFor="line1">Dirección línea 1 *</Label><Input id="line1" name="line1" required placeholder="Calle, número" /></div>
              <div><Label htmlFor="line2">Dirección línea 2</Label><Input id="line2" name="line2" placeholder="Apartamento, piso, etc." /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label htmlFor="city">Ciudad *</Label><Input id="city" name="city" required /></div>
                <div><Label htmlFor="state">Departamento *</Label><Input id="state" name="state" required /></div>
                <div><Label htmlFor="zipCode">Código postal</Label><Input id="zipCode" name="zipCode" /></div>
              </div>
              <div className="flex items-center gap-2"><input type="checkbox" id="isDefault" name="isDefault" className="h-4 w-4 rounded border-input" /><Label htmlFor="isDefault" className="text-sm">Establecer como predeterminada</Label></div>
              <Button type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar Dirección"}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-16"><MapPin className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" /><p className="text-muted-foreground">No tienes direcciones guardadas</p></div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <Card key={addr.id} className={addr.isDefault ? "border-primary" : ""}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2"><span className="font-medium">{addr.name}</span>{addr.isDefault && <Badge variant="success" className="text-xs">Predeterminada</Badge>}</div>
                    <p className="text-sm text-muted-foreground">{addr.line1}</p>
                    {addr.line2 && <p className="text-sm text-muted-foreground">{addr.line2}</p>}
                    <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zipCode}</p>
                    {addr.phone && <p className="text-sm text-muted-foreground">{addr.phone}</p>}
                  </div>
                  <div className="flex gap-2">
                    {!addr.isDefault && <Button variant="ghost" size="sm" onClick={() => setDefault(addr.id)} className="text-xs gap-1"><Star className="h-3 w-3" />Predeterminada</Button>}
                    <Button variant="ghost" size="sm" onClick={() => deleteAddress(addr.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
