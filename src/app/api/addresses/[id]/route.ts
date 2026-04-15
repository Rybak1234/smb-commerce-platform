import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  if (body.isDefault && body.userId) {
    await prisma.address.updateMany({ where: { userId: body.userId }, data: { isDefault: false } });
  }
  const address = await prisma.address.update({ where: { id: params.id }, data: body });
  return NextResponse.json(address);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.address.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
