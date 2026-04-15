import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const giftCards = await prisma.giftCard.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(giftCards);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const code = "GC-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  const giftCard = await prisma.giftCard.create({
    data: {
      code, initialValue: Number(body.value), balance: Number(body.value),
      recipientEmail: body.recipientEmail || null, recipientName: body.recipientName || null,
      senderName: body.senderName || null, message: body.message || null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    },
  });
  return NextResponse.json(giftCard, { status: 201 });
}
