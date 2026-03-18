import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description || null,
      price: body.price,
      image: body.image || null,
      category: body.category || "General",
      stock: body.stock ?? 0,
      active: body.active ?? true,
    },
  });
  return NextResponse.json(product, { status: 201 });
}
