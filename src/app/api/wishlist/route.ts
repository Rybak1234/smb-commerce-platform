import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ wishlisted: false });
  }

  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (productId) {
    const item = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    return NextResponse.json({ wishlisted: !!item });
  }

  const wishlists = await prisma.wishlist.findMany({
    where: { userId },
    include: { product: { include: { reviews: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(wishlists);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { productId } = await req.json();

  if (!productId) {
    return NextResponse.json({ error: "productId requerido" }, { status: 400 });
  }

  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    return NextResponse.json({ wishlisted: false });
  }

  await prisma.wishlist.create({ data: { userId, productId } });
  return NextResponse.json({ wishlisted: true });
}
