import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Store, Star, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VendorsPage() {
  const vendors = await prisma.vendor.findMany({
    where: { verified: true },
    include: {
      user: { select: { name: true, avatar: true } },
      _count: { select: { products: true } },
    },
    orderBy: { rating: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tiendas</h1>
        <p className="text-muted-foreground mt-1">Descubre las tiendas verificadas de SurtiBolivia</p>
      </div>

      {vendors.length === 0 ? (
        <div className="text-center py-24">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <p className="text-lg font-medium">No hay tiendas disponibles</p>
          <p className="text-sm text-muted-foreground mt-1">Pronto habra mas tiendas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <Link key={vendor.id} href={`/vendors/${vendor.slug}`} className="group block bg-card rounded-xl border p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  {vendor.logo ? (
                    <img src={vendor.logo} alt={vendor.storeName} className="h-14 w-14 rounded-full object-cover" />
                  ) : (
                    <Store className="h-7 w-7 text-primary" />
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-lg group-hover:text-primary transition-colors">{vendor.storeName}</h2>
                </div>
              </div>
              {vendor.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{vendor.description}</p>}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><span className="font-medium">{vendor.rating?.toFixed(1) || "0.0"}</span></div>
                <div className="flex items-center gap-1 text-muted-foreground"><Package className="h-4 w-4" /><span>{vendor._count.products} productos</span></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
