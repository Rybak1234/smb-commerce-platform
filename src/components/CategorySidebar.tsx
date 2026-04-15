"use client";

import Link from "next/link";
import { ChevronDown, Folder, Tag } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
  children?: Category[];
}

interface CategorySidebarProps {
  categories: Category[];
  activeSlug?: string;
}

export function CategorySidebar({ categories, activeSlug }: CategorySidebarProps) {
  const parentCategories = categories.filter((c) => !("parentId" in c) || (c as any).parentId === null);

  return (
    <div className="space-y-1">
      <h4 className="text-sm font-semibold mb-3 px-2">Categorías</h4>
      <Link
        href="/"
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
          !activeSlug ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
        )}
      >
        <Tag className="h-4 w-4" />
        Todas
      </Link>

      {parentCategories.map((cat) => {
        const hasChildren = cat.children && cat.children.length > 0;
        const isActive = cat.slug === activeSlug;

        if (hasChildren) {
          return (
            <Accordion key={cat.id} type="single" collapsible>
              <AccordionItem value={cat.id} className="border-none">
                <AccordionTrigger className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:no-underline [&[data-state=open]]:bg-muted",
                  isActive && "bg-primary/10 text-primary font-medium"
                )}>
                  <div className="flex items-center gap-2 flex-1">
                    <Folder className="h-4 w-4" />
                    <span>{cat.name}</span>
                    {cat._count && (
                      <span className="text-xs text-muted-foreground ml-auto mr-2">({cat._count.products})</span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-6 pb-0">
                  {cat.children!.map((child) => (
                    <Link
                      key={child.id}
                      href={`/?category=${child.slug}`}
                      className={cn(
                        "flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors",
                        child.slug === activeSlug
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <span>{child.name}</span>
                      {child._count && <span className="text-xs">({child._count.products})</span>}
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        }

        return (
          <Link
            key={cat.id}
            href={`/?category=${cat.slug}`}
            className={cn(
              "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>{cat.name}</span>
            </div>
            {cat._count && <span className="text-xs">({cat._count.products})</span>}
          </Link>
        );
      })}
    </div>
  );
}
