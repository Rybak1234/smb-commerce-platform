import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.questionId || !body.userId || !body.answer) {
    return NextResponse.json({ error: "questionId, userId, answer required" }, { status: 400 });
  }
  const answer = await prisma.productAnswer.create({
    data: { questionId: body.questionId, userId: body.userId, answer: body.answer },
  });
  return NextResponse.json(answer, { status: 201 });
}
