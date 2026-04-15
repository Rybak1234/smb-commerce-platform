import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import CartBadge from "@/components/CartBadge";
import AuthProvider from "@/components/AuthProvider";
import UserMenu from "@/components/UserMenu";

export const metadata: Metadata = {
  title: "NovaTech · Accesorios Tecnológicos",
  description: "Tu tienda online de accesorios tecnológicos en Bolivia — envío a todo el país, pago seguro con Stripe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
        {/* ── NAV ── */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600">
              Nova<span className="text-gray-800">Tech</span>
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link href="/" className="hover:text-indigo-600 transition-colors">Tienda</Link>
              <CartBadge />
              <UserMenu />
            </div>
          </div>
        </nav>

        {/* ── MAIN ── */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">{children}</main>

        {/* ── FOOTER ── */}
        <footer className="border-t bg-white mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} NovaTech — Accesorios Tecnológicos Bolivia</p>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-indigo-600 transition-colors">Tienda</Link>
              <Link href="/account" className="hover:text-indigo-600 transition-colors">Mi Cuenta</Link>
            </div>
          </div>
        </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
