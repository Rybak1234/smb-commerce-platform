import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "orders";

  let csv = "";
  if (type === "orders") {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { items: true } });
    csv = "ID,Numero,Cliente,Email,Estado,Total,Descuento,Fecha\n";
    orders.forEach(o => {
      csv += `${o.id},${o.orderNumber},${o.customerName},${o.customerEmail},${o.status},${o.total},${o.discountAmount},${o.createdAt.toISOString()}\n`;
    });
  } else if (type === "products") {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    csv = "ID,Nombre,Precio,Stock,Categoria,Ventas,Rating,Activo\n";
    products.forEach(p => {
      csv += `${p.id},"${p.name}",${p.price},${p.stock},${p.categoryName},${p.salesCount},${p.avgRating},${p.active}\n`;
    });
  } else if (type === "users") {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, role: true, loyaltyPoints: true, createdAt: true } });
    csv = "ID,Nombre,Email,Rol,Puntos,Fecha\n";
    users.forEach(u => {
      csv += `${u.id},"${u.name}",${u.email},${u.role},${u.loyaltyPoints},${u.createdAt.toISOString()}\n`;
    });
  }

  return new NextResponse(csv, {
    headers: { "Content-Type": "text/csv", "Content-Disposition": `attachment; filename=${type}-export-${Date.now()}.csv` },
  });
}
