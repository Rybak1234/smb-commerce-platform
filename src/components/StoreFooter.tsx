import Link from "next/link";
import { Store, Mail, Phone, MapPin, Globe, Camera, MessageCircle, Play } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function StoreFooter() {
  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">N</span>
              </div>
              <span className="font-bold text-xl">NovaTech</span>
            </div>
            <p className="text-sm text-muted-foreground">Marketplace de tecnología y accesorios. Los mejores productos de múltiples vendedores verificados en Bolivia.</p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"><Globe className="h-4 w-4" /></a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"><Camera className="h-4 w-4" /></a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"><MessageCircle className="h-4 w-4" /></a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"><Play className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Tienda</h4>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-muted-foreground hover:text-primary transition-colors">Todos los Productos</Link>
              <Link href="/?featured=true" className="block text-muted-foreground hover:text-primary transition-colors">Destacados</Link>
              <Link href="/vendors" className="block text-muted-foreground hover:text-primary transition-colors">Tiendas</Link>
              <Link href="/flash-deals" className="block text-muted-foreground hover:text-primary transition-colors">Ofertas Flash</Link>
              <Link href="/gift-cards" className="block text-muted-foreground hover:text-primary transition-colors">Tarjetas de Regalo</Link>
            </div>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h4 className="font-semibold">Mi Cuenta</h4>
            <div className="space-y-2 text-sm">
              <Link href="/account" className="block text-muted-foreground hover:text-primary transition-colors">Mi Perfil</Link>
              <Link href="/account/orders" className="block text-muted-foreground hover:text-primary transition-colors">Mis Pedidos</Link>
              <Link href="/wishlist" className="block text-muted-foreground hover:text-primary transition-colors">Lista de Deseos</Link>
              <Link href="/account/addresses" className="block text-muted-foreground hover:text-primary transition-colors">Direcciones</Link>
              <Link href="/vendor/register" className="block text-muted-foreground hover:text-primary transition-colors">Vende con Nosotros</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" /><span>La Paz, Bolivia</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4 shrink-0" /><span>+591 2 123 4567</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4 shrink-0" /><span>soporte@novatech.bo</span></div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NovaTech Marketplace. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary transition-colors">Términos</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacidad</Link>
            <Link href="#" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
