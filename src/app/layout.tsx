import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SMB Commerce",
  description: "Tienda online para pequeños negocios",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <nav className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-emerald-600">
              SMB Commerce
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="hover:text-emerald-600">Tienda</Link>
              <Link href="/cart" className="hover:text-emerald-600">🛒 Carrito</Link>
              <Link href="/admin/products" className="hover:text-emerald-600">Admin</Link>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
