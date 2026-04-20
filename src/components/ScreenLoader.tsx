"use client";
import { useState, useEffect } from "react";
import { Store } from "lucide-react";

export function ScreenLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center transition-opacity duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center animate-pulse">
            <Store className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="absolute inset-0 h-16 w-16 rounded-2xl border-2 border-primary/30 animate-ping" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-bold text-foreground">SurtiBolivia</span>
          <div className="flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
