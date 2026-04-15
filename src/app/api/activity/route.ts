import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: any = {};
  if (userId) where.userId = userId;

  const logs = await prisma.activityLog.findMany({
    where, orderBy: { createdAt: "desc" }, take: limit,
    include: { user: { select: { name: true, email: true } } },
  });
  return NextResponse.json(logs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const log = await prisma.activityLog.create({ data: body });
  return NextResponse.json(log, { status: 201 });
}
