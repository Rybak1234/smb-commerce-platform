import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

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
  if (searchParams.cat) {
    where.category = searchParams.cat;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const allCategories = await prisma.product.findMany({
    where: { active: true, stock: { gt: 0 } },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });

  const categories = allCategories.map((c) => c.category);
  const groupedProducts = categories
    .filter((cat) => products.some((p) => p.category === cat))
    .map((cat) => ({ cat, items: products.filter((p) => p.category === cat) }));

  return (
    <div className="animate-fade-in">
      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-2xl p-8 sm:p-12 mb-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIvPjwvc3ZnPg==')] opacity-60" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Bienvenido a SMB Commerce
          </h1>
          <p className="text-emerald-100 text-lg mb-6">
            Descubre productos de calidad a los mejores precios. Pago seguro con Stripe.
          </p>
          <div className="flex gap-3">
            <a href="#catalogo" className="bg-white text-emerald-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-emerald-50 transition-colors text-sm">
              Ver catálogo
            </a>
            <Link href="/admin/products" className="border border-white/40 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm">
              Panel admin
            </Link>
          </div>
        </div>
      </section>

      {/* ── SEARCH + FILTERS ── */}
      <div id="catalogo" className="flex flex-col sm:flex-row gap-4 mb-8">
        <form className="flex-1 relative" action="/" method="GET">
          {searchParams.cat && <input type="hidden" name="cat" value={searchParams.cat} />}
          <input
            name="q"
            defaultValue={searchParams.q}
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-sm"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </form>
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${!searchParams.cat ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border hover:bg-gray-50"}`}
          >
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/?cat=${encodeURIComponent(cat)}${searchParams.q ? `&q=${encodeURIComponent(searchParams.q)}` : ""}`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${searchParams.cat === cat ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border hover:bg-gray-50"}`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* ── RESULTS INFO ── */}
      {(searchParams.q || searchParams.cat) && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <span>{products.length} producto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}</span>
          {searchParams.q && <span className="text-gray-400">para &quot;{searchParams.q}&quot;</span>}
          <Link href="/" className="ml-auto text-emerald-600 hover:underline text-xs">Limpiar filtros</Link>
        </div>
      )}

      {/* ── PRODUCT GRID ── */}
      {groupedProducts.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-400 text-lg">No se encontraron productos</p>
          <Link href="/" className="text-emerald-600 hover:underline text-sm mt-2 inline-block">Ver todos</Link>
        </div>
      )}

      {groupedProducts.map(({ cat, items }) => (
        <section key={cat} className="mb-10 animate-slide-up">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full" />
            {cat}
            <span className="text-sm font-normal text-gray-400 ml-1">({items.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <Link href={`/products/${product.id}`} className="block">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-4xl">
                      📦
                    </div>
                  )}
                </Link>
                <div className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  {product.description && (
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-emerald-600 font-bold text-lg">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${product.stock <= 5 ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                      {product.stock <= 5 ? `¡Solo ${product.stock}!` : `Stock: ${product.stock}`}
                    </span>
                  </div>
                  <AddToCartButton product={product} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
