"use client";

import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Flame, Clock } from "lucide-react";

interface FlashDealBannerProps {
  title: string;
  discount: number;
  endDate: string;
}

export function FlashDealBanner({ title, discount, endDate }: FlashDealBannerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setExpired(true);
        return;
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (expired) return null;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white rounded-xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Flame className="h-8 w-8 animate-pulse" />
          <div>
            <h3 className="font-bold text-lg sm:text-xl">{title}</h3>
            <p className="text-white/80 text-sm">Hasta {discount}% de descuento</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">Termina en:</span>
          <div className="flex gap-1">
            {[
              { val: timeLeft.hours, label: "hrs" },
              { val: timeLeft.minutes, label: "min" },
              { val: timeLeft.seconds, label: "seg" },
            ].map(({ val, label }) => (
              <div key={label} className="bg-black/20 rounded-md px-2 py-1 text-center min-w-[48px]">
                <div className="text-lg font-bold tabular-nums">{pad(val)}</div>
                <div className="text-[10px] uppercase">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
