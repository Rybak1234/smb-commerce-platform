import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product || !product.active) return notFound();

  const related = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id }, active: true, stock: { gt: 0 } },
    take: 4,
  });

  return (
    <div className="animate-fade-in">
      <Link href="/" className="text-sm text-emerald-600 hover:underline mb-6 inline-flex items-center gap-1">
        ← Volver a la tienda
      </Link>

      <div className="grid md:grid-cols-2 gap-8 mt-4">
        {/* Image */}
        <div className="bg-white rounded-2xl overflow-hidden border">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-[400px] object-cover" />
          ) : (
            <div className="w-full h-[400px] bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-7xl">
              📦
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full w-fit font-medium mb-3">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          {product.description && (
            <p className="text-gray-500 leading-relaxed mb-6">{product.description}</p>
          )}

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-4xl font-extrabold text-emerald-600">${product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-400">MXN</span>
          </div>

          <div className={`inline-flex items-center gap-2 text-sm mb-6 ${product.stock <= 5 ? "text-red-600" : "text-gray-500"}`}>
            <span className={`w-2 h-2 rounded-full ${product.stock <= 5 ? "bg-red-500" : "bg-green-500"}`} />
            {product.stock <= 5 ? `¡Solo ${product.stock} en stock!` : `${product.stock} disponibles`}
          </div>

          <div className="max-w-xs">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-6">Productos relacionados</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="bg-white rounded-xl border hover:shadow-md transition-all p-3 group"
              >
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-32 bg-gray-50 rounded-lg mb-2 flex items-center justify-center text-2xl">📦</div>
                )}
                <h3 className="font-medium text-sm truncate">{p.name}</h3>
                <p className="text-emerald-600 font-bold text-sm">${p.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
