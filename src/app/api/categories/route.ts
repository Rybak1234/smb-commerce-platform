import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: { children: { where: { active: true }, orderBy: { order: "asc" } }, _count: { select: { products: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const slug = body.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
  const category = await prisma.category.create({
    data: { name: body.name, slug, description: body.description || null, image: body.image || null, parentId: body.parentId || null, order: body.order || 0 },
  });
  return NextResponse.json(category, { status: 201 });
}
