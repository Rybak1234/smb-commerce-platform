import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, calculateDiscount, formatDate } from "@/lib/utils";
import { Star, Store, ChevronRight, ShoppingBag, Shield, Truck, RotateCcw, Share2, Tag } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.update({
    where: { id: params.id },
    data: { views: { increment: 1 } },
    include: {
      category: true,
      vendor: { select: { storeName: true, slug: true, rating: true, verified: true } },
      variants: true,
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 10 },
      questions: { include: { user: { select: { name: true } }, answers: { include: { user: { select: { name: true } } } } }, orderBy: { createdAt: "desc" }, take: 5 },
    },
  }).catch(() => null);

  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, active: true, id: { not: product.id } },
    include: { category: true, vendor: { select: { storeName: true } } },
    take: 4,
  });

  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0;
  const allImages = [product.image, ...(product.images || [])].filter(Boolean) as string[];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Tienda</Link>
        <ChevronRight className="h-3 w-3" />
        {product.category && (
          <>
            <Link href={`/?category=${product.category.slug}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
            <ChevronRight className="h-3 w-3" />
          </>
        )}
        <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
            {allImages.length > 0 ? (
              <Image src={allImages[0]} alt={product.name} fill className="object-cover" priority />
            ) : (
              <div className="flex items-center justify-center h-full"><ShoppingBag className="h-20 w-20 text-muted-foreground/20" /></div>
            )}
            {discount > 0 && <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">-{discount}%</span>}
            {product.badge && <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-lg">{product.badge}</span>}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {allImages.map((img, i) => (
                <div key={i} className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors cursor-pointer">
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {product.category && <p className="text-xs font-medium text-primary uppercase tracking-wider">{product.category.name}</p>}
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {product.vendor && (
            <Link href={`/vendors/${product.vendor.slug}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Store className="h-4 w-4" />
              {product.vendor.storeName}
              {product.vendor.verified && <Shield className="h-3 w-3 text-blue-500" />}
            </Link>
          )}

          <div className="flex items-center gap-3">
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className={`h-5 w-5 ${s <= Math.round(product.avgRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.avgRating.toFixed(1)} ({product.reviewCount} reseñas)</span>
            <span className="text-sm text-muted-foreground">· {product.views} vistas</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
            {discount > 0 && <span className="text-sm font-medium text-red-500">Ahorras {formatPrice(product.originalPrice! - product.price)}</span>}
          </div>

          {product.description && <p className="text-muted-foreground leading-relaxed">{product.description}</p>}

          <Separator />

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Variantes</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <div key={v.id} className={`px-4 py-2 rounded-lg border text-sm font-medium ${v.stock > 0 ? "hover:border-primary cursor-pointer" : "opacity-40 line-through"}`}>
                    {v.name}: {v.value}
                    {v.price && <span className="ml-1 text-primary">{formatPrice(v.price)}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2 text-sm">
            <Tag className="h-4 w-4" />
            {product.stock > 0 ? (
              <span className="text-green-600 dark:text-green-400 font-medium">{product.stock > 10 ? "En stock" : `Solo ${product.stock} disponibles`}</span>
            ) : (
              <span className="text-destructive font-medium">Agotado</span>
            )}
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: "Envío gratis +Bs.200" },
              { icon: Shield, label: "Pago seguro" },
              { icon: RotateCcw, label: "30 días devolución" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-lg border text-center">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-[10px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>

          {product.brand && <p className="text-sm"><span className="text-muted-foreground">Marca:</span> <span className="font-medium">{product.brand}</span></p>}
          {product.tags && product.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">{product.tags.map((t) => (<span key={t} className="px-2 py-0.5 bg-muted rounded text-xs">{t}</span>))}</div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Reseñas ({product.reviewCount})</h2>
        {product.reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Sin reseñas todavía.</p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="p-4 rounded-xl border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {(review.user.name || "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{review.user.name || "Usuario"}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(review.createdAt.toISOString())}</p>
                    </div>
                  </div>
                  <div className="flex">{[1,2,3,4,5].map((s) => (<Star key={s} className={`h-3 w-3 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`} />))}</div>
                </div>
                {review.title && <p className="font-medium text-sm">{review.title}</p>}
                {review.comment && <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>}
                {review.verified && <span className="text-[10px] text-green-600 font-medium mt-1 inline-block">✓ Compra verificada</span>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Q&A */}
      {product.questions.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Preguntas y Respuestas</h2>
          <div className="space-y-4">
            {product.questions.map((q) => (
              <div key={q.id} className="p-4 rounded-xl border">
                <div className="flex items-start gap-2">
                  <span className="text-sm font-bold text-primary">P:</span>
                  <div className="flex-1">
                    <p className="text-sm">{q.question}</p>
                    <p className="text-xs text-muted-foreground mt-1">{q.user.name || "Usuario"}</p>
                  </div>
                </div>
                {q.answers.map((a) => (
                  <div key={a.id} className="flex items-start gap-2 mt-3 ml-6 p-2 rounded-lg bg-muted/50">
                    <span className="text-sm font-bold text-green-600">R:</span>
                    <div>
                      <p className="text-sm">{a.answer}</p>
                      <p className="text-xs text-muted-foreground mt-1">{a.user.name || "Usuario"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((rp) => (
              <Link key={rp.id} href={`/products/${rp.id}`} className="group bg-card rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border">
                <div className="relative h-48 bg-muted">
                  {rp.image ? <Image src={rp.image} alt={rp.name} fill className="object-cover group-hover:scale-105 transition-transform" /> : <div className="flex items-center justify-center h-full"><ShoppingBag className="h-10 w-10 text-muted-foreground/20" /></div>}
                </div>
                <div className="p-4">
                  <p className="text-[10px] uppercase text-muted-foreground">{rp.category?.name}</p>
                  <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">{rp.name}</h3>
                  <span className="text-primary font-bold">{formatPrice(rp.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

