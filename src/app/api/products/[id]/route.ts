import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      originalPrice: body.originalPrice ?? null,
      image: body.image,
      images: body.images ?? undefined,
      category: body.category,
      badge: body.badge ?? null,
      featured: body.featured ?? false,
      stock: body.stock,
      active: body.active,
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
