import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import StarRating from "@/components/StarRating";
import WishlistButton from "@/components/WishlistButton";

export const dynamic = "force-dynamic";

const categoryIcons: Record<string, string> = {
  Audio: "🎧",
  "Energía": "⚡",
  "Accesorios PC": "💻",
  Cables: "🔌",
  Streaming: "📸",
  "Protección": "🛡️",
};

export default async function StorePage({
  searchParams,
}: {
  searchParams: { q?: string; cat?: string };
}) {
  const where: Record<string, unknown> = { active: true, stock: { gt: 0 } };
  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: "insensitive" } },
      { description: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }
  if (searchParams.cat) where.category = searchParams.cat;

  const [products, allCategories, featuredProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { reviews: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { active: true, stock: { gt: 0 } },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    }),
    prisma.product.findMany({
      where: { featured: true, active: true, stock: { gt: 0 } },
      include: { reviews: true },
      take: 4,
    }),
  ]);

  const categories = allCategories.map((c) => c.category);
  const groupedProducts = categories
    .filter((cat) => products.some((p) => p.category === cat))
    .map((cat) => ({ cat, items: products.filter((p) => p.category === cat) }));

  const getAvgRating = (reviews: { rating: number }[]) =>
    reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white rounded-3xl p-8 sm:p-14 mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs font-medium mb-4 border border-white/20">
            Envio gratis en pedidos +Bs. 200
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Tecnologia que <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-100">impulsa tu dia</span>
          </h1>
          <p className="text-indigo-100 text-lg mb-8 max-w-lg">
            Los mejores accesorios tecnologicos en Bolivia. Calidad premium, precios accesibles y envio a todo el pais.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="#catalogo" className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all text-sm shadow-lg shadow-indigo-900/20 hover:shadow-xl hover:-translate-y-0.5">
              Explorar catalogo
            </a>
            <Link href="/account" className="border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-all text-sm backdrop-blur-sm">
              Mi cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { icon: "🚚", title: "Envio gratis", desc: "En pedidos +Bs. 200" },
          { icon: "🔒", title: "Pago seguro", desc: "Stripe protegido" },
          { icon: "↩️", title: "Devolucion facil", desc: "30 dias de garantia" },
          { icon: "💬", title: "Soporte 24/7", desc: "Te ayudamos siempre" },
        ].map((item) => (
          <div key={item.title} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && !searchParams.cat && !searchParams.q && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Productos Destacados</h2>
              <p className="text-sm text-gray-500 mt-1">Seleccionados especialmente para ti</p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">Top picks</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => {
              const avg = getAvgRating(product.reviews);
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;
              return (
                <div key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ring-2 ring-amber-100">
                  <div className="relative">
                    <Link href={`/products/${product.id}`} className="block overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-56 bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center text-5xl">📦</div>
                      )}
                    </Link>
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">DESTACADO</span>
                      {discount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">-{discount}%</span>}
                      {product.badge && <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">{product.badge}</span>}
                    </div>
                    <div className="absolute top-3 right-3"><WishlistButton productId={product.id} /></div>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">{product.category}</p>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
                    </Link>
                    {avg > 0 && <div className="mt-1.5"><StarRating rating={avg} count={product.reviews.length} /></div>}
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-indigo-600 font-bold text-lg">Bs. {product.price.toFixed(2)}</span>
                      {product.originalPrice && <span className="text-gray-400 text-sm line-through">Bs. {product.originalPrice.toFixed(2)}</span>}
                    </div>
                    <AddToCartButton product={product} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* CATEGORY BROWSE */}
      {!searchParams.cat && !searchParams.q && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Explorar por categoria</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/?cat=${encodeURIComponent(cat)}`}
                className="flex flex-col items-center gap-2 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md hover:border-indigo-200 hover:-translate-y-1 transition-all duration-200"
              >
                <span className="text-3xl">{categoryIcons[cat] || "📦"}</span>
                <span className="text-xs font-medium text-gray-700 text-center">{cat}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* SEARCH + FILTERS */}
      <div id="catalogo" className="flex flex-col sm:flex-row gap-4 mb-8">
        <form className="flex-1 relative" action="/" method="GET">
          {searchParams.cat && <input type="hidden" name="cat" value={searchParams.cat} />}
          <input
            name="q"
            defaultValue={searchParams.q}
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition text-sm shadow-sm"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </form>
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/"
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${!searchParams.cat ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-white text-gray-600 border hover:bg-gray-50 hover:border-indigo-200"}`}
          >
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/?cat=${encodeURIComponent(cat)}${searchParams.q ? `&q=${encodeURIComponent(searchParams.q)}` : ""}`}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${searchParams.cat === cat ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-white text-gray-600 border hover:bg-gray-50 hover:border-indigo-200"}`}
            >
              {categoryIcons[cat] ? `${categoryIcons[cat]} ` : ""}{cat}
            </Link>
          ))}
        </div>
      </div>

      {/* RESULTS INFO */}
      {(searchParams.q || searchParams.cat) && (
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg font-medium">{products.length}</span>
          <span>producto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}</span>
          {searchParams.q && <span className="text-gray-400">para &quot;{searchParams.q}&quot;</span>}
          <Link href="/" className="ml-auto text-indigo-600 hover:underline text-xs font-medium">
            Limpiar filtros
          </Link>
        </div>
      )}

      {/* PRODUCT GRID */}
      {groupedProducts.length === 0 && (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium">No se encontraron productos</p>
          <p className="text-gray-400 text-sm mt-1">Intenta con otra busqueda o categoria</p>
          <Link href="/" className="inline-block mt-4 text-indigo-600 hover:underline text-sm font-medium">Ver todos los productos</Link>
        </div>
      )}

      {groupedProducts.map(({ cat, items }) => (
        <section key={cat} className="mb-12 animate-slide-up">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">{categoryIcons[cat] || "📦"}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{cat}</h2>
              <p className="text-xs text-gray-400">{items.length} producto{items.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex-1 h-px bg-gray-100 ml-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((product) => {
              const avg = getAvgRating(product.reviews);
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;
              return (
                <div key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                  <div className="relative">
                    <Link href={`/products/${product.id}`} className="block overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-52 bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center text-5xl">📦</div>
                      )}
                    </Link>
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {discount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">-{discount}%</span>}
                      {product.badge && <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">{product.badge}</span>}
                      {product.featured && !searchParams.cat && !searchParams.q && <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">*</span>}
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <WishlistButton productId={product.id} />
                    </div>
                    {product.stock <= 5 && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-red-600/80 to-transparent py-2 px-3">
                        <p className="text-white text-[10px] font-bold">Solo {product.stock} disponible{product.stock !== 1 ? "s" : ""}!</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">{product.category}</p>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
                    </Link>
                    {product.description && (
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">{product.description}</p>
                    )}
                    {avg > 0 && <div className="mt-2"><StarRating rating={avg} count={product.reviews.length} /></div>}
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-indigo-600 font-bold text-lg">Bs. {product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-gray-400 text-xs line-through">Bs. {product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <AddToCartButton product={product} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* NEWSLETTER */}
      {!searchParams.cat && !searchParams.q && (
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 text-white mt-4 mb-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">No quieres perderte nada?</h2>
            <p className="text-gray-300 mb-6">Suscribete y recibe ofertas exclusivas, novedades y descuentos directamente en tu bandeja.</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:bg-white/15 focus:border-white/40 outline-none transition text-sm"
              />
              <button className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 rounded-xl transition text-sm whitespace-nowrap shadow-lg shadow-indigo-500/20">
                Suscribirse
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">No spam. Cancela cuando quieras.</p>
          </div>
        </section>
      )}
    </div>
  );
}
