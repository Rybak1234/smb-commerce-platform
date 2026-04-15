import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.code || !body.discount) return NextResponse.json({ error: "Code and discount required" }, { status: 400 });
  const coupon = await prisma.coupon.create({
    data: {
      code: body.code.toUpperCase(), description: body.description || null,
      type: body.type || "percentage", discount: Number(body.discount),
      minAmount: body.minAmount ? Number(body.minAmount) : null,
      maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : null,
      maxUses: body.maxUses ? Number(body.maxUses) : null,
      perUser: body.perUser ? Number(body.perUser) : null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    },
  });
  return NextResponse.json(coupon, { status: 201 });
}
