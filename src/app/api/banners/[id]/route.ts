import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const banner = await prisma.banner.update({ where: { id: params.id }, data: body });
  return NextResponse.json(banner);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.banner.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
