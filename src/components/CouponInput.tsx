"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface CouponResult {
  valid: boolean;
  discount: number;
  code: string;
  message?: string;
}

export default function CouponInput({ subtotal, onApply }: { subtotal: number; onApply: (discount: number, code: string) => void }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState<CouponResult | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase(), subtotal }),
      });
      const data: CouponResult = await res.json();
      if (data.valid) {
        setApplied(data);
        onApply(data.discount, data.code);
        toast.success(`¡Cupón aplicado! -${data.discount}% de descuento`, { icon: "🎉" });
      } else {
        toast.error(data.message || "Cupón inválido");
      }
    } catch {
      toast.error("Error al validar el cupón");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setApplied(null);
    setCode("");
    onApply(0, "");
    toast.success("Cupón eliminado");
  };

  if (applied) {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
        <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-green-800">{applied.code}</p>
          <p className="text-xs text-green-600">-{applied.discount}% aplicado</p>
        </div>
        <button onClick={handleRemove} className="text-green-600 hover:text-red-500 transition text-xs font-medium">
          Quitar
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Código de descuento"
        className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition uppercase"
        onKeyDown={(e) => e.key === "Enter" && handleApply()}
      />
      <button
        onClick={handleApply}
        disabled={loading || !code.trim()}
        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-40 transition"
      >
        {loading ? "..." : "Aplicar"}
      </button>
    </div>
  );
}
