import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import CartBadge from "@/components/CartBadge";
import AuthProvider from "@/components/AuthProvider";
import UserMenu from "@/components/UserMenu";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "NovaTech · Accesorios Tecnológicos",
  description: "Tu tienda online de accesorios tecnológicos en Bolivia — envío a todo el país, pago seguro con Stripe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
        <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px' } }} />

        {/* ── PROMO BAR ── */}
        <div className="bg-indigo-600 text-white text-center py-2 text-xs font-medium tracking-wide">
          🚀 Envío gratis en pedidos +Bs. 200 · Usa código <span className="font-bold">NOVA10</span> para 10% OFF
        </div>

        {/* ── NAV ── */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600 flex items-center gap-1.5">
              <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-extrabold">N</span>
              Nova<span className="text-gray-800">Tech</span>
            </Link>
            <div className="flex items-center gap-5 text-sm font-medium text-gray-600">
              <Link href="/" className="hover:text-indigo-600 transition-colors hidden sm:block">Tienda</Link>
              <Link href="/wishlist" className="hover:text-red-500 transition-colors relative" title="Favoritos">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </Link>
              <CartBadge />
              <UserMenu />
            </div>
          </div>
        </nav>

        {/* ── MAIN ── */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">{children}</main>

        {/* ── FOOTER ── */}
        <footer className="border-t bg-gray-900 text-gray-300 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-1.5">
                  <span className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-extrabold">N</span>
                  NovaTech
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Los mejores accesorios tecnológicos en Bolivia. Calidad premium y envío a todo el país.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Tienda</h4>
                <div className="space-y-2 text-sm">
                  <Link href="/" className="block hover:text-indigo-400 transition-colors">Catálogo</Link>
                  <Link href="/?cat=Audio" className="block hover:text-indigo-400 transition-colors">Audio</Link>
                  <Link href="/?cat=Energía" className="block hover:text-indigo-400 transition-colors">Energía</Link>
                  <Link href="/?cat=Accesorios+PC" className="block hover:text-indigo-400 transition-colors">Accesorios PC</Link>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Mi Cuenta</h4>
                <div className="space-y-2 text-sm">
                  <Link href="/account" className="block hover:text-indigo-400 transition-colors">Mi Perfil</Link>
                  <Link href="/cart" className="block hover:text-indigo-400 transition-colors">Carrito</Link>
                  <Link href="/wishlist" className="block hover:text-indigo-400 transition-colors">Favoritos</Link>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Soporte</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-400">soporte@novatech.bo</p>
                  <p className="text-gray-400">+591 70012345</p>
                  <p className="text-gray-400">La Paz, Bolivia</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
              <p>&copy; {new Date().getFullYear()} NovaTech — Accesorios Tecnológicos Bolivia</p>
              <div className="flex gap-4">
                <span>💳 Stripe</span>
                <span>🔒 SSL Seguro</span>
                <span>🚚 Envío Nacional</span>
              </div>
            </div>
          </div>
        </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
