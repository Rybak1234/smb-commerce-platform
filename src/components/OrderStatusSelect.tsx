"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  paid: "bg-green-50 text-green-700 border-green-200",
  shipped: "bg-blue-50 text-blue-700 border-blue-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  const handleChange = async (newStatus: string) => {
    setUpdating(true);
    setStatus(newStatus);
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setUpdating(false);
    router.refresh();
  };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={updating}
      className={`text-xs font-medium px-2 py-1 rounded-lg border cursor-pointer outline-none transition ${statusStyles[status] || "bg-gray-50"} ${updating ? "opacity-50" : ""}`}
    >
      <option value="pending">Pendiente</option>
      <option value="paid">Pagada</option>
      <option value="shipped">Enviada</option>
      <option value="cancelled">Cancelada</option>
    </select>
  );
}
