"use client";

import { TrendingUp, DollarSign, ShoppingBag, Users, Package, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatPrice } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: "revenue" | "orders" | "products" | "users" | "sales" | "analytics";
  trend?: { value: number; label: string };
}

const iconMap = {
  revenue: DollarSign,
  orders: ShoppingBag,
  products: Package,
  users: Users,
  sales: TrendingUp,
  analytics: BarChart3,
};

export function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  const Icon = iconMap[icon];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(trend || description) && (
          <div className="flex items-center gap-1 mt-1 text-xs">
            {trend && (
              <>
                {trend.value >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={cn(trend.value >= 0 ? "text-green-500" : "text-red-500")}>
                  {trend.value >= 0 ? "+" : ""}{trend.value}%
                </span>
              </>
            )}
            {description && <span className="text-muted-foreground">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
