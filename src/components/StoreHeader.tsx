"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import { useTheme } from "next-themes";
import { Search, ShoppingCart, Heart, Bell, Sun, Moon, Menu, X, User, Package, Settings, LogOut, Store, ChevronDown, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { SearchCommand } from "@/components/SearchCommand";
import { ScreenLoader } from "@/components/ScreenLoader";

export function StoreHeader({ categories }: { categories?: any[] }) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const user = session?.user as any;
  const router = useRouter();
  const [quickLoading, setQuickLoading] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);

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
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                <Store className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl hidden sm:block tracking-tight">SurtiBolivia</span>
            </Link>

            {/* Search Bar */}
            <button onClick={() => setSearchOpen(true)} className="hidden md:flex items-center gap-3 h-10 w-full max-w-md mx-6 px-4 rounded-xl border bg-muted/40 text-sm text-muted-foreground hover:bg-muted/70 hover:border-primary/30 transition-all duration-200 group">
              <Search className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
              <span className="flex-1 text-left">Buscar productos, marcas, categorias...</span>
              <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded-md border bg-background px-1.5 font-mono text-[10px] font-medium">Ctrl K</kbd>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:block text-sm">Cuenta</span>
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 p-0">
                    <div className="p-4 border-b bg-muted/30">
                      <p className="text-sm font-semibold mb-1">Bienvenido a SurtiBolivia</p>
                      <p className="text-xs text-muted-foreground mb-3">Inicia sesion o crea una cuenta</p>
                      <div className="flex gap-2">
                        <Link href="/login" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full gap-1.5">
                            <LogIn className="h-3.5 w-3.5" /> Ingresar
                          </Button>
                        </Link>
                        <Link href="/register" className="flex-1">
                          <Button size="sm" className="w-full gap-1.5">
                            <UserPlus className="h-3.5 w-3.5" /> Registrarse
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2 px-1">Acceso rapido</p>
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {[
                          { src: "https://i.pravatar.cc/80?img=1", name: "Maria", email: "maria@surtibolivia.bo", pass: "user123" },
                          { src: "https://i.pravatar.cc/80?img=5", name: "Carlos", email: "carlos@surtibolivia.bo", pass: "user123" },
                          { src: "https://i.pravatar.cc/80?img=8", name: "Lucia", email: "lucia@surtibolivia.bo", pass: "user123" },
                          { src: "https://i.pravatar.cc/80?img=12", name: "Admin", email: "admin@surtibolivia.bo", pass: "Password123!" },
                        ].map((av) => (
                          <button
                            key={av.email}
                            disabled={!!quickLoading}
                            onClick={async () => {
                              setQuickLoading(av.email);
                              const res = await signIn("credentials", { email: av.email, password: av.pass, redirect: false });
                              setQuickLoading(null);
                              if (!res?.error) { setShowLoader(true); router.refresh(); }
                            }}
                            className="flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                          >
                            <Avatar className={cn("h-10 w-10 ring-2 transition-all", quickLoading === av.email ? "ring-primary animate-pulse" : "ring-transparent hover:ring-primary")}>
                              <AvatarImage src={av.src} />
                              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <span className="text-[10px] text-muted-foreground">{av.name}</span>
                          </button>
                        ))}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="mt-1">
                        <Link href="/login" className="flex items-center gap-2 text-xs">
                          <Package className="h-3.5 w-3.5" /> Seguir mi pedido
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/wishlist" className="flex items-center gap-2 text-xs">
                          <Heart className="h-3.5 w-3.5" /> Crear lista de deseos
                        </Link>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
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
      {showLoader && <ScreenLoader />}
    </>
  );
}
