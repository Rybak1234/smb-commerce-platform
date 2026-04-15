import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const userId = searchParams.get("userId");
  const where: any = {};
  if (status) where.status = status;
  if (userId) where.userId = userId;

  const refunds = await prisma.refundRequest.findMany({
    where, orderBy: { createdAt: "desc" },
    include: { order: { select: { orderNumber: true, total: true } }, user: { select: { name: true, email: true } } },
  });
  return NextResponse.json(refunds);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.orderId || !body.userId || !body.reason) {
    return NextResponse.json({ error: "orderId, userId, reason required" }, { status: 400 });
  }
  const refund = await prisma.refundRequest.create({
    data: { orderId: body.orderId, userId: body.userId, reason: body.reason, amount: Number(body.amount) || 0, notes: body.notes || null },
  });
  return NextResponse.json(refund, { status: 201 });
}
