import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const deals = await prisma.flashDeal.findMany({
    where: { active: true, endDate: { gte: new Date() } },
    orderBy: { endDate: "asc" },
  });
  return NextResponse.json(deals);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const deal = await prisma.flashDeal.create({
    data: {
      title: body.title, productId: body.productId || null,
      discount: Number(body.discount), startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    },
  });
  return NextResponse.json(deal, { status: 201 });
}
