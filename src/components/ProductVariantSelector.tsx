"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Variant {
  id: string;
  name: string;
  value: string;
  price?: number | null;
  stock: number;
  image?: string | null;
}

interface ProductVariantSelectorProps {
  variants: Variant[];
  selectedId: string | null;
  onSelect: (variant: Variant) => void;
}

export function ProductVariantSelector({ variants, selectedId, onSelect }: ProductVariantSelectorProps) {
  // Group variants by name (e.g. "Color", "Talla")
  const groups = variants.reduce((acc, v) => {
    if (!acc[v.name]) acc[v.name] = [];
    acc[v.name].push(v);
    return acc;
  }, {} as Record<string, Variant[]>);

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([groupName, groupVariants]) => (
        <div key={groupName}>
          <label className="text-sm font-medium mb-2 block">{groupName}</label>
          <div className="flex flex-wrap gap-2">
            {groupVariants.map((variant) => {
              const isSelected = variant.id === selectedId;
              const isOutOfStock = variant.stock === 0;

              return (
                <button
                  key={variant.id}
                  onClick={() => !isOutOfStock && onSelect(variant)}
                  disabled={isOutOfStock}
                  className={cn(
                    "relative px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                      : "border-border hover:border-primary/50",
                    isOutOfStock && "opacity-40 cursor-not-allowed line-through"
                  )}
                >
                  {variant.value}
                  {isOutOfStock && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 text-[10px] px-1 py-0">
                      Agotado
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
