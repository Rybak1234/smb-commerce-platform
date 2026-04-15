import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { status, notes } = await req.json();
  const refund = await prisma.refundRequest.update({ where: { id: params.id }, data: { status, notes } });
  return NextResponse.json(refund);
}
