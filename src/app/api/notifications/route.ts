import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const unreadCount = await prisma.notification.count({ where: { userId, read: false } });
  return NextResponse.json({ notifications, unreadCount });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const notification = await prisma.notification.create({ data: body });
  return NextResponse.json(notification, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { userId, id } = await req.json();
  if (id) {
    await prisma.notification.update({ where: { id }, data: { read: true } });
  } else if (userId) {
    await prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
  }
  return NextResponse.json({ success: true });
}
