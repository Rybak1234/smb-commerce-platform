import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: { select: { name: true, slug: true } },
      vendor: { select: { storeName: true, slug: true, logo: true, rating: true } },
      variants: true,
      reviews: { include: { user: { select: { name: true, avatar: true } } }, orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.product.update({ where: { id: params.id }, data: { views: { increment: 1 } } });
  const related = await prisma.product.findMany({
    where: { active: true, categoryId: product.categoryId, id: { not: product.id } },
    take: 8,
    select: { id: true, name: true, slug: true, price: true, originalPrice: true, image: true, avgRating: true, reviewCount: true, badge: true },
  });
  return NextResponse.json({ ...product, related });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { id, createdAt, updatedAt, reviews, wishlists, orderItems, variants, collections, category, vendor, related, ...data } = body;
  const product = await prisma.product.update({ where: { id: params.id }, data });
  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.product.update({ where: { id: params.id }, data: { active: false } });
  return NextResponse.json({ success: true });
}
