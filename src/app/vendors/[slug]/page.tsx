import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Store, Star, ArrowLeft, Package } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice, calculateDiscount } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function VendorPage({ params }: { params: { slug: string } }) {
  const vendor = await prisma.vendor.findUnique({
    where: { slug: params.slug },
    include: {
      user: { select: { name: true, avatar: true } },
      products: { where: { active: true }, include: { category: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!vendor) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/vendors" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4" /> Volver a tiendas
      </Link>

      <div className="bg-card rounded-xl border p-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            {vendor.logo ? (
              <img src={vendor.logo} alt={vendor.storeName} className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <Store className="h-10 w-10 text-primary" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{vendor.storeName}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{vendor.rating?.toFixed(1) || "0.0"}</span>
              <span className="flex items-center gap-1"><Package className="h-4 w-4" />{vendor.products.length} productos</span>
            </div>
            {vendor.description && <p className="text-muted-foreground mt-3">{vendor.description}</p>}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Productos</h2>
      {vendor.products.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Esta tienda aun no tiene productos</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {vendor.products.map((product) => {
            const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0;
            return (
              <Link key={product.id} href={`/products/${product.id}`} className="group bg-card rounded-xl overflow-hidden border hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="aspect-square overflow-hidden bg-muted relative">
                    <ProductImage src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  {discount > 0 && <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded">-{discount}%</span>}
                </div>
                <div className="p-4">
                  {product.category && <p className="text-xs text-primary font-medium">{product.category.name}</p>}
                  <h3 className="font-medium line-clamp-2 mt-1 group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
