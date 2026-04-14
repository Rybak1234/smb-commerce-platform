import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-6 -mx-4 -my-8">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-gray-900 min-h-screen px-4 py-6 text-white">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Admin Panel</p>
          <p className="text-lg font-bold text-emerald-400 mt-1">SMBCommerce</p>
        </div>
        <nav className="space-y-1">
          <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            📊 Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            🛍️ Productos
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            📦 Órdenes
          </Link>
          <Link href="/admin/users" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            👥 Usuarios
          </Link>
          <div className="border-t border-gray-700 my-3" />
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            ← Volver a la Tienda
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 py-8 pr-4">
        {children}
      </main>
    </div>
  );
}
