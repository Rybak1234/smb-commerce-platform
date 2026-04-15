import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const questions = await prisma.productQuestion.findMany({
    where: { productId },
    include: { user: { select: { name: true } }, answers: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(questions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.productId || !body.userId || !body.question) {
    return NextResponse.json({ error: "productId, userId, question required" }, { status: 400 });
  }
  const question = await prisma.productQuestion.create({
    data: { productId: body.productId, userId: body.userId, question: body.question },
  });
  return NextResponse.json(question, { status: 201 });
}
