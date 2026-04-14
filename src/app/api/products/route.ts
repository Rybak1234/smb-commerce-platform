import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const active = searchParams.get("active");

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (active !== null) where.active = active !== "false";

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (body.price == null || isNaN(Number(body.price)) || Number(body.price) < 0) {
    return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name: body.name.trim(),
      description: body.description?.trim() || null,
      price: Number(body.price),
      image: body.image?.trim() || null,
      category: body.category?.trim() || "General",
      stock: Math.max(0, parseInt(body.stock) || 0),
      active: body.active ?? true,
    },
  });
  return NextResponse.json(product, { status: 201 });
}
