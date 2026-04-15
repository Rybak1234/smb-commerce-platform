import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: { select: { name: true, image: true, slug: true } } } }, user: { select: { name: true, email: true } }, refundRequests: true },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const data: any = {};
  if (body.status && VALID_STATUSES.includes(body.status)) data.status = body.status;
  if (body.paymentStatus) data.paymentStatus = body.paymentStatus;
  if (body.trackingNumber) data.trackingNumber = body.trackingNumber;
  if (body.trackingUrl) data.trackingUrl = body.trackingUrl;
  if (body.notes !== undefined) data.notes = body.notes;

  const order = await prisma.order.update({ where: { id: params.id }, data });
  return NextResponse.json(order);
}
