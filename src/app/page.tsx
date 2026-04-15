import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Star, ArrowRight, ShoppingBag, Truck, Shield, Headphones, Zap, Gift, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StorePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; featured?: string; page?: string; sort?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = 12;

  const where: any = { active: true };
  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: "insensitive" } },
      { description: { contains: searchParams.q, mode: "insensitive" } },
      { brand: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }
  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }
  if (searchParams.featured === "true") where.featured = true;

  let orderBy: any = { createdAt: "desc" };
  if (searchParams.sort === "price-asc") orderBy = { price: "asc" };
  if (searchParams.sort === "price-desc") orderBy = { price: "desc" };
  if (searchParams.sort === "popular") orderBy = { salesCount: "desc" };
  if (searchParams.sort === "rating") orderBy = { avgRating: "desc" };

  const isFiltered = !!(searchParams.q || searchParams.category || searchParams.featured);

  const [products, totalProducts, categories, featuredProducts, trendingProducts, banners, flashDeals] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true, vendor: { select: { storeName: true } } }, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { active: true, parentId: null }, include: { _count: { select: { products: true } } }, orderBy: { order: "asc" }, take: 8 }),
    isFiltered ? Promise.resolve([]) : prisma.product.findMany({ where: { featured: true, active: true }, include: { category: true, vendor: { select: { storeName: true } } }, take: 8 }),
    isFiltered ? Promise.resolve([]) : prisma.product.findMany({ where: { trending: true, active: true }, include: { category: true, vendor: { select: { storeName: true } } }, take: 4 }),
    isFiltered ? Promise.resolve([]) : prisma.banner.findMany({ where: { active: true, position: "hero" }, orderBy: { order: "asc" }, take: 3 }),
    isFiltered ? Promise.resolve([]) : prisma.flashDeal.findMany({ where: { active: true, endDate: { gt: new Date() }, startDate: { lte: new Date() } }, take: 4 }),
  ]);

  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div className="min-h-screen">
      {!isFiltered && (
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-violet-700 dark:from-primary/80 dark:via-violet-800 dark:to-purple-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-xs font-medium mb-6 border border-white/20">
                <Zap className="h-3 w-3 mr-1.5" /> Marketplace Multi-Vendor
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                Tecnología que <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-100">transforma</span>
              </h1>
              <p className="text-white/80 text-lg mb-8 max-w-lg">Múltiples vendedores verificados, ofertas flash, programa de lealtad y los mejores precios de Bolivia.</p>
              <div className="flex gap-3 flex-wrap">
                <a href="#productos" className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3.5 rounded-xl hover:bg-white/90 transition-all text-sm shadow-lg">
                  <ShoppingBag className="h-4 w-4" /> Explorar Tienda
                </a>
                <Link href="/vendor/register" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/10 transition-all text-sm backdrop-blur-sm">
                  Vende con Nosotros <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-8">
        {!isFiltered && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 -mt-8 relative z-20 mb-10">
            {[
              { icon: Truck, title: "Envío Gratis", desc: "En pedidos +Bs. 200" },
              { icon: Shield, title: "Pago Seguro", desc: "Stripe protegido" },
              { icon: Gift, title: "Programa de Lealtad", desc: "Gana puntos" },
              { icon: Headphones, title: "Soporte 24/7", desc: "Siempre disponibles" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 bg-card rounded-xl p-4 border shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isFiltered && categories.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Categorías</h2>
              <Link href="/" className="text-sm text-primary hover:underline flex items-center gap-1">Ver todas <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/?category=${cat.slug}`} className="flex flex-col items-center gap-2.5 bg-card rounded-xl border p-4 hover:shadow-md hover:border-primary/30 hover:-translate-y-1 transition-all duration-200">
                  {cat.image ? (
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden"><Image src={cat.image} alt={cat.name} fill className="object-cover" /></div>
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"><ShoppingBag className="h-6 w-6 text-primary" /></div>
                  )}
                  <div className="text-center">
                    <span className="text-xs font-medium">{cat.name}</span>
                    <p className="text-[10px] text-muted-foreground">{cat._count.products} productos</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!isFiltered && flashDeals.length > 0 && (
          <section className="mb-12">
            <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4"><Zap className="h-6 w-6" /><h2 className="text-xl font-bold">Ofertas Flash</h2></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {flashDeals.map((deal: any) => (
                  <div key={deal.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <span className="inline-block bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded mb-2">-{deal.discount}%</span>
                    <h3 className="font-semibold text-sm line-clamp-2">{deal.title}</h3>
                    <p className="text-white/60 text-xs mt-1">Válida hasta {new Date(deal.endDate).toLocaleDateString("es-BO")}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {!isFiltered && featuredProducts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div><h2 className="text-2xl font-bold">Productos Destacados</h2><p className="text-sm text-muted-foreground mt-1">Selección premium de nuestros vendedores</p></div>
              <Link href="/?featured=true" className="text-sm text-primary hover:underline flex items-center gap-1">Ver todos <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.slice(0, 4).map((product) => (<ProductCardServer key={product.id} product={product} badge="Destacado" />))}
            </div>
          </section>
        )}

        {!isFiltered && trendingProducts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6"><TrendingUp className="h-5 w-5 text-primary" /><h2 className="text-2xl font-bold">Tendencia</h2></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trendingProducts.map((product) => (<ProductCardServer key={product.id} product={product} badge="Trending" />))}
            </div>
          </section>
        )}

        {isFiltered && (
          <div className="flex items-center gap-2 mb-6 text-sm">
            <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-lg font-medium">{totalProducts}</span>
            <span className="text-muted-foreground">resultado{totalProducts !== 1 ? "s" : ""}</span>
            {searchParams.q && <span className="text-muted-foreground">para &quot;{searchParams.q}&quot;</span>}
            <Link href="/" className="ml-auto text-primary hover:underline text-xs font-medium">Limpiar filtros</Link>
          </div>
        )}

        <section id="productos" className="mb-12">
          {!isFiltered && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Todos los Productos</h2>
              <div className="flex gap-2">
                {[{ label: "Recientes", val: "" }, { label: "Precio ↑", val: "price-asc" }, { label: "Precio ↓", val: "price-desc" }, { label: "Popular", val: "popular" }, { label: "Rating", val: "rating" }].map((s) => (
                  <Link key={s.val} href={`/?sort=${s.val}`} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${(searchParams.sort || "") === s.val ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{s.label}</Link>
                ))}
              </div>
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-24">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"><ShoppingBag className="h-10 w-10 text-muted-foreground/30" /></div>
              <p className="text-lg font-medium">No se encontraron productos</p>
              <p className="text-sm text-muted-foreground mt-1">Intenta con otra búsqueda o categoría</p>
              <Link href="/" className="inline-block mt-4 text-primary hover:underline text-sm font-medium">Ver todos los productos</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => (<ProductCardServer key={product.id} product={product} />))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && <Link href={`/?page=${page - 1}${searchParams.sort ? `&sort=${searchParams.sort}` : ""}${searchParams.category ? `&category=${searchParams.category}` : ""}${searchParams.q ? `&q=${searchParams.q}` : ""}`} className="px-4 py-2 rounded-lg border text-sm hover:bg-muted transition-colors">Anterior</Link>}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => { const p = page <= 3 ? i + 1 : page + i - 2; if (p < 1 || p > totalPages) return null; return (<Link key={p} href={`/?page=${p}${searchParams.sort ? `&sort=${searchParams.sort}` : ""}${searchParams.category ? `&category=${searchParams.category}` : ""}${searchParams.q ? `&q=${searchParams.q}` : ""}`} className={`px-4 py-2 rounded-lg text-sm transition-colors ${p === page ? "bg-primary text-primary-foreground" : "border hover:bg-muted"}`}>{p}</Link>); })}
              {page < totalPages && <Link href={`/?page=${page + 1}${searchParams.sort ? `&sort=${searchParams.sort}` : ""}${searchParams.category ? `&category=${searchParams.category}` : ""}${searchParams.q ? `&q=${searchParams.q}` : ""}`} className="px-4 py-2 rounded-lg border text-sm hover:bg-muted transition-colors">Siguiente</Link>}
            </div>
          )}
        </section>

        {!isFiltered && (
          <section className="bg-gradient-to-r from-primary/10 to-violet-500/10 dark:from-primary/5 dark:to-violet-500/5 rounded-2xl p-8 sm:p-12 mb-8 border">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">No te pierdas nada</h2>
              <p className="text-muted-foreground mb-6">Suscríbete y recibe ofertas exclusivas, novedades y descuentos directamente en tu email.</p>
              <div className="flex gap-2 max-w-md mx-auto">
                <input type="email" placeholder="tu@email.com" className="flex-1 px-4 py-3 rounded-xl bg-background border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm" />
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl transition text-sm whitespace-nowrap shadow-lg shadow-primary/20">Suscribirse</button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Sin spam. Cancela cuando quieras.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ProductCardServer({ product, badge }: { product: any; badge?: string }) {
  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0;
  return (
    <div className="group bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border">
      <div className="relative">
        <Link href={`/products/${product.id}`} className="block overflow-hidden">
          {product.image ? (
            <Image src={product.image} alt={product.name} width={400} height={400} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-56 bg-muted flex items-center justify-center"><ShoppingBag className="h-12 w-12 text-muted-foreground" /></div>
          )}
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {badge && <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-md">{badge}</span>}
          {discount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">-{discount}%</span>}
          {product.badge && !badge && <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded-md">{product.badge}</span>}
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-orange-600/80 to-transparent py-2 px-3">
            <p className="text-white text-[10px] font-bold">Solo {product.stock} disponible{product.stock !== 1 ? "s" : ""}!</p>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="bg-background text-foreground text-sm font-bold px-4 py-2 rounded-lg">Agotado</span></div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{product.category?.name || "Sin categoría"}</p>
          {product.vendor && <p className="text-[10px] text-muted-foreground">{product.vendor.storeName}</p>}
        </div>
        <Link href={`/products/${product.id}`}><h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3></Link>
        {product.avgRating > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex">{[1,2,3,4,5].map((s) => (<Star key={s} className={`h-3 w-3 ${s <= Math.round(product.avgRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`} />))}</div>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
        )}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-primary font-bold text-lg">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && <span className="text-muted-foreground text-xs line-through">{formatPrice(product.originalPrice)}</span>}
        </div>
      </div>
    </div>
  );
}

