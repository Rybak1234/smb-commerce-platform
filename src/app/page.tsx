import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Star, ArrowRight, ShoppingBag, Truck, Shield, Headphones, Zap, Gift, TrendingUp } from "lucide-react";
import { NewsletterForm } from "@/components/NewsletterForm";

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
    prisma.category.findMany({ where: { active: true, parentId: null }, include: { _count: { select: { products: true } } }, orderBy: { order: "asc" }, take: 12 }),
    isFiltered ? Promise.resolve([]) : prisma.product.findMany({ where: { featured: true, active: true }, include: { category: true, vendor: { select: { storeName: true } } }, take: 8 }),
    isFiltered ? Promise.resolve([]) : prisma.product.findMany({ where: { trending: true, active: true }, include: { category: true, vendor: { select: { storeName: true } } }, take: 4 }),
    isFiltered ? Promise.resolve([]) : prisma.banner.findMany({ where: { active: true, position: "hero" }, orderBy: { order: "asc" }, take: 3 }),
    isFiltered ? Promise.resolve([]) : prisma.flashDeal.findMany({ where: { active: true, endDate: { gt: new Date() }, startDate: { lte: new Date() } }, take: 4 }),
  ]);

  // Fetch product images for flash deals
  const dealProductIds = (flashDeals as any[]).map((d: any) => d.productId).filter(Boolean);
  const dealProducts = dealProductIds.length > 0
    ? await prisma.product.findMany({ where: { id: { in: dealProductIds } }, select: { id: true, image: true, images: true } })
    : [];
  const dealProductMap = new Map(dealProducts.map(p => [p.id, p.image || p.images?.[0] || null]));

  const totalPages = Math.ceil(totalProducts / pageSize);



  return (
    <div className="min-h-screen">
      {!isFiltered && (
        <section className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 dark:from-indigo-900 dark:via-violet-900 dark:to-purple-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-xs font-medium mb-6 border border-white/20 animate-slide-down">
                  El supermercado de la familia boliviana
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight animate-slide-up">
                  Tu mercado de <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-violet-200">confianza</span>
                </h1>
                <p className="text-white/80 text-lg mb-8 max-w-lg animate-slide-up stagger-2">Abarrotes, frutas frescas, lacteos, carnes, ropa artesanal y mucho mas. Todo en un solo lugar.</p>
                <div className="flex gap-3 flex-wrap animate-slide-up stagger-3">
                  <a href="#productos" className="inline-flex items-center gap-2 bg-white text-indigo-800 font-bold px-6 py-3.5 rounded-xl hover:bg-white/90 hover:scale-105 active:scale-95 transition-all text-sm shadow-lg">
                    <ShoppingBag className="h-4 w-4" /> Empezar a Comprar
                  </a>
                  <Link href="/?featured=true" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/10 hover:scale-105 active:scale-95 transition-all text-sm backdrop-blur-sm">
                    Ver Destacados <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block animate-slide-left stagger-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
                  <ProductImage
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=500&fit=crop"
                    alt="Productos frescos SurtiBolivia"
                    className="rounded-3xl shadow-2xl w-full h-[400px] object-cover opacity-90 border border-white/10"
                    width={600}
                    height={500}
                    priority
                  />
                  <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-xl animate-float">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center"><Truck className="h-4 w-4 text-green-600" /></div>
                      <div><p className="text-xs font-bold text-gray-900">Envio gratis</p><p className="text-[10px] text-gray-500">En pedidos +Bs 200</p></div>
                    </div>
                  </div>
                  <div className="absolute -top-3 -right-3 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-xl animate-bounce-soft">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center"><Star className="h-4 w-4 text-yellow-600" /></div>
                      <div><p className="text-xs font-bold text-gray-900">+500 productos</p><p className="text-[10px] text-gray-500">Calidad boliviana</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-8">
        {!isFiltered && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 -mt-8 relative z-20 mb-10">
            {[
              { icon: Truck, title: "Envio a Domicilio", desc: "A todo el pais" },
              { icon: Shield, title: "Productos Frescos", desc: "Calidad garantizada" },
              { icon: Gift, title: "Ofertas Semanales", desc: "Los mejores precios" },
              { icon: Headphones, title: "Soporte WhatsApp", desc: "+591 2 123 4567" },
            ].map((item, i) => (
              <div key={item.title} className={`flex items-center gap-3 bg-card rounded-xl p-4 border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`} data-aos="fade-up" data-aos-delay={i * 100}>
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
          <section className="mb-12" data-aos="fade-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Secciones</h2>
              <Link href="/?category=all" className="text-sm text-primary hover:underline flex items-center gap-1">Ver todas <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/?category=${cat.slug}`} className="flex flex-col items-center gap-2.5 bg-card rounded-xl border p-4 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1.5 transition-all duration-300 animate-flip-y">
                  {cat.image ? (
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden"><ProductImage src={cat.image} alt={cat.name} className="object-cover w-full h-full" width={56} height={56} /></div>
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center"><ShoppingBag className="h-7 w-7 text-primary" /></div>
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
          <section className="mb-12" data-aos="zoom-in">
            <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4"><Zap className="h-6 w-6" /><h2 className="text-xl font-bold">Ofertas del Día</h2></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {flashDeals.map((deal: any) => (
                  <Link key={deal.id} href={`/products/${deal.productId}`} className="group/deal block bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                    {deal.productId && dealProductMap.get(deal.productId) && (
                      <div className="h-32 w-full overflow-hidden relative">
                        <ProductImage src={dealProductMap.get(deal.productId)!} alt={deal.title} className="object-cover group-hover/deal:scale-105 transition-transform duration-500" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                      </div>
                    )}
                    <div className="p-4">
                      <span className="inline-block bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded mb-2">-{deal.discount}%</span>
                      <h3 className="font-semibold text-sm line-clamp-2 mb-2">{deal.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5 text-yellow-200" />
                          <span className="text-xs text-white/80 font-medium">Oferta limitada</span>
                        </div>
                        <span className="text-[10px] text-white/60">Hasta {new Date(deal.endDate).toLocaleDateString("es-BO")}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {!isFiltered && featuredProducts.length > 0 && (
          <section className="mb-12" data-aos="fade-up">
            <div className="flex items-center justify-between mb-6">
              <div><h2 className="text-2xl font-bold">Lo Más Buscado</h2><p className="text-sm text-muted-foreground mt-1">Los favoritos de nuestros clientes</p></div>
              <Link href="/?featured=true" className="text-sm text-primary hover:underline flex items-center gap-1">Ver todos <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.slice(0, 4).map((product) => (<ProductCardServer key={product.id} product={product} badge="Destacado" />))}
            </div>
          </section>
        )}

        {!isFiltered && trendingProducts.length > 0 && (
          <section className="mb-12" data-aos="fade-up">
            <div className="flex items-center gap-2 mb-6"><TrendingUp className="h-5 w-5 text-primary" /><h2 className="text-2xl font-bold">Tendencia</h2></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trendingProducts.map((product) => (<ProductCardServer key={product.id} product={product} badge="Popular" />))}
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

        <section id="productos" className="mb-12" data-aos="fade-up">
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
          <section className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/5 dark:to-accent/5 rounded-2xl p-8 sm:p-12 mb-8 border animate-slide-blur-left" data-aos="fade-up">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">No te pierdas nada</h2>
              <p className="text-muted-foreground mb-6">Suscríbete y recibe ofertas exclusivas, novedades y descuentos directamente en tu email.</p>
              <NewsletterForm />
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
    <div className="group bg-card rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border hover:-translate-y-1 animate-fade-in">
      <div className="relative">
        <Link href={`/products/${product.id}`} className="block overflow-hidden relative">
          <ProductImage src={product.images?.[0] || product.image} alt={product.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" width={400} height={224} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
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

