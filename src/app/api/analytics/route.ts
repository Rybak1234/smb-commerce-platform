import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "30d";

  const now = new Date();
  let startDate = new Date();
  if (period === "7d") startDate.setDate(now.getDate() - 7);
  else if (period === "30d") startDate.setDate(now.getDate() - 30);
  else if (period === "90d") startDate.setDate(now.getDate() - 90);
  else if (period === "1y") startDate.setFullYear(now.getFullYear() - 1);
  else startDate.setDate(now.getDate() - 30);

  const [
    totalRevenue, totalOrders, totalProducts, totalUsers,
    recentOrders, topProducts, pendingRefunds, activeVendors,
    lowStockProducts, ordersByStatus, newUsersCount,
  ] = await Promise.all([
    prisma.order.aggregate({ where: { createdAt: { gte: startDate }, paymentStatus: "paid" }, _sum: { total: true } }),
    prisma.order.count({ where: { createdAt: { gte: startDate } } }),
    prisma.product.count({ where: { active: true } }),
    prisma.user.count(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { items: { include: { product: { select: { name: true, image: true } } } } } }),
    prisma.product.findMany({ where: { active: true }, orderBy: { salesCount: "desc" }, take: 10, select: { id: true, name: true, image: true, price: true, salesCount: true, avgRating: true, stock: true } }),
    prisma.refundRequest.count({ where: { status: "pending" } }),
    prisma.vendor.count({ where: { status: "approved" } }),
    prisma.product.findMany({ where: { active: true, stock: { lte: 5 } }, select: { id: true, name: true, stock: true, image: true }, orderBy: { stock: "asc" }, take: 10 }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
    prisma.user.count({ where: { createdAt: { gte: startDate } } }),
  ]);

  // Revenue by day for chart
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: startDate }, paymentStatus: "paid" },
    select: { createdAt: true, total: true },
    orderBy: { createdAt: "asc" },
  });

  const revenueByDay: Record<string, number> = {};
  orders.forEach(o => {
    const day = o.createdAt.toISOString().split("T")[0];
    revenueByDay[day] = (revenueByDay[day] || 0) + o.total;
  });
  const revenueChart = Object.entries(revenueByDay).map(([date, revenue]) => ({ date, revenue: Math.round(revenue * 100) / 100 }));

  return NextResponse.json({
    overview: {
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders, totalProducts, totalUsers, pendingRefunds,
      activeVendors, newUsersCount,
      avgOrderValue: totalOrders > 0 ? Math.round(((totalRevenue._sum.total || 0) / totalOrders) * 100) / 100 : 0,
    },
    recentOrders, topProducts, lowStockProducts, ordersByStatus, revenueChart,
  });
}
