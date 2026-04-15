import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  if (q.length < 2) return NextResponse.json({ products: [], categories: [], vendors: [] });

  const [products, categories, vendors] = await Promise.all([
    prisma.product.findMany({
      where: { active: true, OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }, { brand: { contains: q, mode: "insensitive" } }] },
      select: { id: true, name: true, slug: true, price: true, image: true, categoryName: true },
      take: 8,
    }),
    prisma.category.findMany({
      where: { active: true, name: { contains: q, mode: "insensitive" } },
      select: { id: true, name: true, slug: true, image: true },
      take: 4,
    }),
    prisma.vendor.findMany({
      where: { status: "approved", storeName: { contains: q, mode: "insensitive" } },
      select: { id: true, storeName: true, slug: true, logo: true },
      take: 4,
    }),
  ]);

  return NextResponse.json({ products, categories, vendors });
}
