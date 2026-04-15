import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Tag, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } }, children: { include: { _count: { select: { products: true } } } } },
    where: { parentId: null },
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Categorías</h1><p className="text-sm text-muted-foreground mt-1">Gestiona las categorías de productos</p></div>
      </div>

      {categories.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><Tag className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" /><p className="text-muted-foreground">No hay categorías</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Tag className="h-5 w-5 text-primary" /></div>
                    <div>
                      <p className="font-semibold">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">{cat.slug} · {cat._count.products} productos</p>
                    </div>
                  </div>
                  <Badge variant={cat.active ? "success" : "secondary"}>{cat.active ? "Activa" : "Inactiva"}</Badge>
                </div>
                {cat.children.length > 0 && (
                  <div className="mt-3 ml-6 space-y-2">
                    {cat.children.map((child) => (
                      <div key={child.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{child.name}</span>
                          <span className="text-xs text-muted-foreground">({child._count.products})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
