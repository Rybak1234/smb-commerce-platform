import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const vendor = await prisma.vendor.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true, email: true, avatar: true } }, products: { where: { active: true }, take: 20 }, _count: { select: { products: true } } },
  });
  if (!vendor) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(vendor);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const vendor = await prisma.vendor.update({ where: { id: params.id }, data: body });
  return NextResponse.json(vendor);
}
