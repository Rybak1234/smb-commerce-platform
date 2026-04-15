import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const collections = await prisma.collection.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: { products: { include: { product: true }, take: 8 }, _count: { select: { products: true } } },
  });
  return NextResponse.json(collections);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const slug = body.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
  const collection = await prisma.collection.create({
    data: { name: body.name, slug, description: body.description || null, image: body.image || null, type: body.type || "manual", order: body.order || 0 },
  });
  return NextResponse.json(collection, { status: 201 });
}
