"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Search, ShoppingCart, Heart, Bell, Sun, Moon, Menu, X, User, Package, Settings, LogOut, Store, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { SearchCommand } from "@/components/SearchCommand";

export function StoreHeader({ categories }: { categories?: any[] }) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const user = session?.user as any;

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const update = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.reduce((sum: number, i: any) => sum + i.quantity, 0));
    };
    update();
    window.addEventListener("cartUpdated", update);
    window.addEventListener("storage", update);
    return () => { window.removeEventListener("cartUpdated", update); window.removeEventListener("storage", update); };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); } };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Promo Banner */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
        🎉 Marketplace NovaTech — Envío gratis en compras mayores a Bs. 200 · Código: <span className="font-bold">NOVA10</span>
      </div>

      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">N</span>
              </div>
              <span className="font-bold text-xl hidden sm:block">NovaTech</span>
            </Link>

            {/* Search Bar */}
            <button onClick={() => setSearchOpen(true)} className="hidden md:flex items-center gap-2 h-10 w-full max-w-sm mx-4 px-4 rounded-lg border bg-muted/50 text-sm text-muted-foreground hover:bg-muted transition-colors">
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left">Buscar productos...</span>
              <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">⌘K</kbd>
            </button>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>

              {mounted && (
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              )}

              {user && (
                <Link href="/wishlist">
                  <Button variant="ghost" size="icon"><Heart className="h-5 w-5" /></Button>
                </Link>
              )}

              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">{cartCount}</span>}
                </Button>
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:block text-sm">{user.name?.split(" ")[0]}</span>
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/account"><User className="mr-2 h-4 w-4" />Mi Cuenta</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/account/orders"><Package className="mr-2 h-4 w-4" />Mis Pedidos</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/wishlist"><Heart className="mr-2 h-4 w-4" />Favoritos</Link></DropdownMenuItem>
                    {user.role === "vendor" && (
                      <DropdownMenuItem asChild><Link href="/vendor"><Store className="mr-2 h-4 w-4" />Mi Tienda</Link></DropdownMenuItem>
                    )}
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild><Link href="/admin"><Settings className="mr-2 h-4 w-4" />Admin Panel</Link></DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="text-destructive"><LogOut className="mr-2 h-4 w-4" />Cerrar Sesión</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login"><Button variant="ghost" size="sm">Ingresar</Button></Link>
                  <Link href="/register"><Button size="sm">Registrarse</Button></Link>
                </div>
              )}

              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Categories Nav */}
          {categories && categories.length > 0 && (
            <nav className="hidden md:flex items-center gap-6 pb-3 overflow-x-auto">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">Inicio</Link>
              {categories.slice(0, 8).map(cat => (
                <Link key={cat.id} href={`/?category=${cat.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">{cat.name}</Link>
              ))}
              <Link href="/vendors" className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">Tiendas</Link>
            </nav>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background p-4 space-y-2">
            <Link href="/" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
            {categories?.map(cat => (
              <Link key={cat.id} href={`/?category=${cat.id}`} className="block py-2 text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>{cat.name}</Link>
            ))}
            <Link href="/vendors" className="block py-2 text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Tiendas</Link>
          </div>
        )}
      </header>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
