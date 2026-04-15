"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

interface PriceFilterProps {
  min?: number;
  max?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function PriceFilter({ min = 0, max = 10000, value, onChange }: PriceFilterProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSliderChange = (v: number[]) => {
    setLocalValue([v[0], v[1]]);
  };

  const handleApply = () => {
    onChange(localValue);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold">Rango de Precio</h4>
      <Slider
        min={min}
        max={max}
        step={10}
        value={localValue}
        onValueChange={handleSliderChange}
      />
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={localValue[0]}
          onChange={(e) => setLocalValue([Number(e.target.value), localValue[1]])}
          className="h-8 text-sm"
          min={min}
          max={localValue[1]}
        />
        <span className="text-muted-foreground text-sm">-</span>
        <Input
          type="number"
          value={localValue[1]}
          onChange={(e) => setLocalValue([localValue[0], Number(e.target.value)])}
          className="h-8 text-sm"
          min={localValue[0]}
          max={max}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatPrice(localValue[0])}</span>
        <span>{formatPrice(localValue[1])}</span>
      </div>
      <Button size="sm" variant="outline" className="w-full" onClick={handleApply}>
        Aplicar
      </Button>
    </div>
  );
}
