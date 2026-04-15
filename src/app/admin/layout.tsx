"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, Image as ImageIcon, Percent, Store, BarChart3, Settings, Bell, FileDown, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Productos" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Pedidos" },
  { href: "/admin/users", icon: Users, label: "Usuarios" },
  { href: "/admin/categories", icon: Tag, label: "Categorías" },
  { href: "/admin/vendors", icon: Store, label: "Vendedores" },
  { href: "/admin/coupons", icon: Percent, label: "Cupones" },
  { href: "/admin/banners", icon: ImageIcon, label: "Banners" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/settings", icon: Settings, label: "Config" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?error=unauthorized");
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") router.push("/login?error=unauthorized");
  }, [status, session, router]);

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!session || (session.user as any)?.role !== "admin") return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card shrink-0 hidden lg:block">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center"><span className="text-primary-foreground font-bold">N</span></div>
            <div><p className="font-bold text-sm">NovaTech Admin</p><p className="text-[10px] text-muted-foreground">Panel de Administración</p></div>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="p-3 space-y-1">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors", pathname === href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                <Icon className="h-4 w-4" />{label}
              </Link>
            ))}
          </div>
          <div className="p-3 mt-4 border-t">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">
              <ArrowLeft className="h-4 w-4" />Volver a la Tienda
            </Link>
          </div>
        </ScrollArea>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}

