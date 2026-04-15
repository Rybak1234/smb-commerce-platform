import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const vendorId = searchParams.get("vendorId");
  const status = searchParams.get("status");
  const where: any = {};
  if (vendorId) where.vendorId = vendorId;
  if (status) where.status = status;

  const payouts = await prisma.payout.findMany({
    where, orderBy: { createdAt: "desc" },
    include: { vendor: { select: { storeName: true } } },
  });
  return NextResponse.json(payouts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const payout = await prisma.payout.create({
    data: { vendorId: body.vendorId, amount: Number(body.amount), method: body.method || "bank_transfer" },
  });
  return NextResponse.json(payout, { status: 201 });
}
