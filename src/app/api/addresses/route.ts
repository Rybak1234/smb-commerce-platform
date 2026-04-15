import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(addresses);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  if (body.isDefault) {
    await prisma.address.updateMany({ where: { userId: body.userId }, data: { isDefault: false } });
  }
  const address = await prisma.address.create({ data: body });
  return NextResponse.json(address, { status: 201 });
}
