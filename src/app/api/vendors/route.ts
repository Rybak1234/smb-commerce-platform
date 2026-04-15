import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const where: any = {};
  if (status) where.status = status;

  const vendors = await prisma.vendor.findMany({
    where,
    include: { user: { select: { name: true, email: true } }, _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(vendors);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.userId || !body.storeName) return NextResponse.json({ error: "userId and storeName required" }, { status: 400 });
  const slug = body.storeName.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
  const vendor = await prisma.vendor.create({
    data: {
      userId: body.userId, storeName: body.storeName, slug,
      description: body.description || null, logo: body.logo || null,
      banner: body.banner || null, phone: body.phone || null,
      email: body.email || null, website: body.website || null,
    },
  });
  await prisma.user.update({ where: { id: body.userId }, data: { role: "vendor" } });
  return NextResponse.json(vendor, { status: 201 });
}
