"use client";

import { Check, Package, Truck, MapPin, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils";

const STEPS = [
  { status: "pending", label: "Pendiente", icon: Clock },
  { status: "confirmed", label: "Confirmado", icon: Check },
  { status: "processing", label: "En Proceso", icon: Package },
  { status: "shipped", label: "Enviado", icon: Truck },
  { status: "delivered", label: "Entregado", icon: MapPin },
];

const CANCELLED = { status: "cancelled", label: "Cancelado", icon: XCircle };

interface OrderTrackingTimelineProps {
  currentStatus: string;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  updatedAt?: string;
}

export function OrderTrackingTimeline({ currentStatus, trackingNumber, trackingUrl, updatedAt }: OrderTrackingTimelineProps) {
  const isCancelled = currentStatus === "cancelled";
  const currentIndex = STEPS.findIndex((s) => s.status === currentStatus);

  return (
    <div className="space-y-6">
      <div className="relative">
        {isCancelled ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <XCircle className="h-6 w-6 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Pedido Cancelado</p>
              {updatedAt && <p className="text-xs text-muted-foreground">{formatDateTime(updatedAt)}</p>}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isComplete = i <= currentIndex;
              const isCurrent = i === currentIndex;

              return (
                <div key={step.status} className="flex flex-col items-center flex-1">
                  {/* Connector */}
                  {i > 0 && (
                    <div className="absolute h-0.5 top-5" style={{ left: `${((i - 1) / (STEPS.length - 1)) * 100 + 100 / (STEPS.length - 1) / 2}%`, width: `${100 / (STEPS.length - 1) - 100 / (STEPS.length - 1) / 2}%` }}>
                      <div className={cn("h-full transition-colors", isComplete ? "bg-primary" : "bg-muted")} />
                    </div>
                  )}
                  <div
                    className={cn(
                      "relative z-10 h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all",
                      isComplete
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-muted text-muted-foreground",
                      isCurrent && "ring-4 ring-primary/20"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={cn("text-xs mt-2 text-center", isComplete ? "font-medium" : "text-muted-foreground")}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {trackingNumber && (
        <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Nro. de Seguimiento:</span>
          {trackingUrl ? (
            <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-primary hover:underline">
              {trackingNumber}
            </a>
          ) : (
            <span className="font-mono">{trackingNumber}</span>
          )}
        </div>
      )}
    </div>
  );
}
