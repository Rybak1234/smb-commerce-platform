import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const products = await prisma.product.findMany({
    where: { active: true, stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
  });

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Nuestra Tienda</h1>
      <p className="text-gray-500 mb-6">Explora nuestros productos disponibles</p>

      {categories.length === 0 && (
        <p className="text-gray-400 text-center py-12">
          No hay productos disponibles aún.
        </p>
      )}

      {categories.map((cat) => (
        <section key={cat} className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-emerald-700">{cat}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products
              .filter((p) => p.category === cat)
              .map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden"
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    {product.description && (
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-emerald-600 font-bold text-lg">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400">
                        Stock: {product.stock}
                      </span>
                    </div>
                    <button
                      className="mt-3 w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition text-sm"
                      data-product-id={product.id}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
