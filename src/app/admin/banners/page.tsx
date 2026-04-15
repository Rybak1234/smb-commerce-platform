import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: { order: "asc" } });

  const positionLabels: Record<string, string> = { hero: "Hero", sidebar: "Sidebar", popup: "Popup", bar: "Barra" };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Banners</h1><p className="text-sm text-muted-foreground mt-1">Gestiona banners promocionales</p></div>

      {banners.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><ImageIcon className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" /><p className="text-muted-foreground">No hay banners</p></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {banners.map((b) => (
            <Card key={b.id} className="overflow-hidden">
              {b.image && (
                <div className="h-40 bg-muted relative">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{b.title}</h3>
                  <div className="flex gap-1">
                    <Badge variant="outline">{positionLabels[b.position] || b.position}</Badge>
                    <Badge variant={b.active ? "success" : "secondary"}>{b.active ? "Activo" : "Inactivo"}</Badge>
                  </div>
                </div>
                {b.subtitle && <p className="text-sm text-muted-foreground">{b.subtitle}</p>}
                {b.link && <p className="text-xs text-primary truncate">{b.link}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
