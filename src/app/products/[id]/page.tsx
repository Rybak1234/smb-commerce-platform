import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import StarRating from "@/components/StarRating";
import WishlistButton from "@/components/WishlistButton";
import ProductReviews from "./ProductReviews";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!product || !product.active) return notFound();

  const related = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id }, active: true, stock: { gt: 0 } },
    include: { reviews: true },
    take: 4,
  });

  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: product.reviews.filter((r) => r.rating === star).length,
    pct: product.reviews.length
      ? (product.reviews.filter((r) => r.rating === star).length / product.reviews.length) * 100
      : 0,
  }));

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const allImages = [product.image, ...(product.images || [])].filter(Boolean) as string[];

  return (
    <div className="animate-fade-in">
      {/* ── BREADCRUMB ── */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Tienda</Link>
        <span>/</span>
        <Link href={`/?cat=${encodeURIComponent(product.category)}`} className="hover:text-indigo-600 transition-colors">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* ── IMAGE GALLERY ── */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl overflow-hidden border shadow-sm">
            {allImages.length > 0 ? (
              <img src={allImages[0]} alt={product.name} className="w-full h-[420px] object-cover" />
            ) : (
              <div className="w-full h-[420px] bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center text-8xl">📦</div>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((img, i) => (
                <div key={i} className={`rounded-xl overflow-hidden border-2 ${i === 0 ? "border-indigo-500" : "border-transparent"} hover:border-indigo-300 transition cursor-pointer`}>
                  <img src={img} alt="" className="w-full h-20 object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── PRODUCT INFO ── */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg font-medium">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="text-xs bg-violet-100 text-violet-700 px-2.5 py-1 rounded-lg font-medium">
                    {product.badge}
                  </span>
                )}
                {product.featured && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg font-medium">
                    ⭐ Destacado
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-lg font-bold">
                    -{discount}% OFF
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{product.name}</h1>
            </div>
            <WishlistButton productId={product.id} size="md" />
          </div>

          {/* Rating summary */}
          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={avgRating} size="md" />
              <span className="text-sm text-gray-500">
                {avgRating.toFixed(1)} · {product.reviews.length} reseña{product.reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {product.description && (
            <p className="text-gray-500 leading-relaxed mt-4">{product.description}</p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-6 p-4 bg-gray-50 rounded-xl">
            <span className="text-4xl font-extrabold text-indigo-600">Bs. {product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">Bs. {product.originalPrice.toFixed(2)}</span>
            )}
            <span className="text-xs text-gray-400 ml-auto">BOB</span>
          </div>

          {/* Stock */}
          <div className={`mt-4 flex items-center gap-2 text-sm ${product.stock <= 5 ? "text-red-600" : "text-gray-500"}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${product.stock <= 5 ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
            {product.stock <= 5 ? `¡Solo ${product.stock} en stock!` : `${product.stock} disponibles`}
          </div>

          {/* Add to cart */}
          <div className="mt-6 max-w-sm">
            <AddToCartButton product={product} />
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: "🚚", label: "Envío gratis" },
              { icon: "🔒", label: "Pago seguro" },
              { icon: "↩️", label: "30 días garantía" },
            ].map((f) => (
              <div key={f.label} className="text-center p-3 bg-white rounded-xl border">
                <div className="text-lg mb-1">{f.icon}</div>
                <p className="text-[10px] text-gray-500 font-medium">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── REVIEWS SECTION ── */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reseñas de clientes</h2>
          <span className="text-sm text-gray-400">{product.reviews.length} reseña{product.reviews.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Rating breakdown */}
          <div className="bg-white rounded-xl border p-5">
            <div className="text-center mb-4">
              <p className="text-5xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
              <div className="flex justify-center mt-2"><StarRating rating={avgRating} size="lg" /></div>
              <p className="text-sm text-gray-400 mt-1">{product.reviews.length} reseña{product.reviews.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="space-y-2">
              {ratingBreakdown.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-3 text-gray-500">{star}</span>
                  <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-right text-gray-400 text-xs">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review list + form */}
          <div className="lg:col-span-2">
            <ProductReviews productId={product.id} initialReviews={product.reviews.map((r) => ({
              id: r.id,
              rating: r.rating,
              comment: r.comment,
              userName: r.user.name,
              createdAt: r.createdAt.toISOString(),
            }))} />
          </div>
        </div>
      </section>

      {/* ── RELATED PRODUCTS ── */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">También te puede gustar</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => {
              const rAvg = p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0;
              const rDiscount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
              return (
                <Link key={p.id} href={`/products/${p.id}`} className="bg-white rounded-2xl border hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <div className="relative overflow-hidden">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-40 bg-gray-50 flex items-center justify-center text-3xl">📦</div>
                    )}
                    {rDiscount > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">-{rDiscount}%</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{p.name}</h3>
                    {rAvg > 0 && <div className="mt-1"><StarRating rating={rAvg} count={p.reviews.length} /></div>}
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <p className="text-indigo-600 font-bold text-sm">Bs. {p.price.toFixed(2)}</p>
                      {p.originalPrice && <span className="text-gray-400 text-xs line-through">Bs. {p.originalPrice.toFixed(2)}</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
