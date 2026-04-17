"use client";
import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, Package, Tag, Store } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { cn, formatPrice } from "@/lib/utils";
import Link from "next/link";

export function SearchCommand({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>({ products: [], categories: [], vendors: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
    else setQuery("");
  }, [open]);

  useEffect(() => {
    if (query.length < 2) { setResults({ products: [], categories: [], vendors: [] }); return; }
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`).then(r => r.json()).then(setResults).finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const hasResults = results.products.length > 0 || results.categories.length > 0 || results.vendors.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden" aria-describedby={undefined}>
        <VisuallyHidden.Root><DialogTitle>Buscar</DialogTitle></VisuallyHidden.Root>
        <div className="flex items-center border-b px-3 pt-1">
          <Search className="h-4 w-4 shrink-0 opacity-50 mr-2" />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar productos, categorías, tiendas..." className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground" />
          {query && <button onClick={() => setQuery("")}><X className="h-4 w-4 opacity-50" /></button>}
        </div>
        <div className="max-h-[400px] overflow-y-auto p-2">
          {loading && <div className="p-8 text-center text-sm text-muted-foreground">Buscando...</div>}
          {!loading && query.length >= 2 && !hasResults && <div className="p-8 text-center text-sm text-muted-foreground">No se encontraron resultados</div>}
          {results.categories.length > 0 && (
            <div className="mb-2">
              <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Categorías</p>
              {results.categories.map((c: any) => (
                <Link key={c.id} href={`/?category=${c.id}`} onClick={() => onOpenChange(false)} className="flex items-center gap-3 rounded-sm px-2 py-2 hover:bg-accent">
                  <Tag className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{c.name}</span>
                </Link>
              ))}
            </div>
          )}
          {results.vendors.length > 0 && (
            <div className="mb-2">
              <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Tiendas</p>
              {results.vendors.map((v: any) => (
                <Link key={v.id} href={`/vendors/${v.slug}`} onClick={() => onOpenChange(false)} className="flex items-center gap-3 rounded-sm px-2 py-2 hover:bg-accent">
                  <Store className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{v.storeName}</span>
                </Link>
              ))}
            </div>
          )}
          {results.products.length > 0 && (
            <div>
              <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Productos</p>
              {results.products.map((p: any) => (
                <Link key={p.id} href={`/products/${p.id}`} onClick={() => onOpenChange(false)} className="flex items-center gap-3 rounded-sm px-2 py-2 hover:bg-accent">
                  {p.image ? <img src={p.image} alt="" className="h-10 w-10 rounded object-cover" /> : <Package className="h-10 w-10 p-2 text-muted-foreground" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.categoryName}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatPrice(p.price)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
          <span>Ctrl+K para buscar</span>
          <span>ESC para cerrar</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
