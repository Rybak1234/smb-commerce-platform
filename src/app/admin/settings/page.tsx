"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";

const defaultSettings = [
  { key: "store_name", label: "Nombre de la Tienda", category: "general", value: "NovaTech" },
  { key: "store_email", label: "Email de Contacto", category: "general", value: "soporte@novatech.bo" },
  { key: "store_phone", label: "Teléfono", category: "general", value: "+591 2 123 4567" },
  { key: "store_address", label: "Dirección", category: "general", value: "La Paz, Bolivia" },
  { key: "free_shipping_min", label: "Envío Gratis (mín. Bs.)", category: "shipping", value: "200" },
  { key: "default_commission", label: "Comisión Vendedores (%)", category: "vendors", value: "10" },
  { key: "loyalty_points_rate", label: "Puntos por Bs. 1", category: "loyalty", value: "1" },
  { key: "referral_reward", label: "Recompensa Referido (Bs.)", category: "loyalty", value: "20" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) {
        setSettings((prev) => prev.map((s) => { const found = data.find((d: any) => d.key === s.key); return found ? { ...s, value: found.value } : s; }));
      }
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const s of settings) {
        await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: s.key, value: s.value, category: s.category }) });
      }
      toast.success("Configuración guardada");
    } catch { toast.error("Error al guardar"); }
    setSaving(false);
  };

  const grouped = settings.reduce((acc, s) => { (acc[s.category] = acc[s.category] || []).push(s); return acc; }, {} as Record<string, typeof settings>);
  const categoryLabels: Record<string, string> = { general: "General", shipping: "Envío", vendors: "Vendedores", loyalty: "Programa de Lealtad" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Configuración</h1><p className="text-sm text-muted-foreground mt-1">Ajustes del marketplace</p></div>
        <Button onClick={handleSave} disabled={saving} className="gap-2"><Save className="h-4 w-4" />{saving ? "Guardando..." : "Guardar"}</Button>
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <Card key={cat}>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Settings className="h-4 w-4" />{categoryLabels[cat] || cat}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {items.map((s) => (
              <div key={s.key} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <Label className="text-sm">{s.label}</Label>
                <Input value={s.value} onChange={(e) => setSettings((prev) => prev.map((p) => p.key === s.key ? { ...p, value: e.target.value } : p))} className="sm:col-span-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
