import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json();

  if (!code) {
    return NextResponse.json({ valid: false, message: "Código requerido" });
  }

  const coupon = await prisma.coupon.findUnique({ where: { code } });

  if (!coupon || !coupon.active) {
    return NextResponse.json({ valid: false, message: "Cupón inválido o inactivo" });
  }

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return NextResponse.json({ valid: false, message: "Cupón expirado" });
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ valid: false, message: "Cupón agotado" });
  }

  if (coupon.minAmount && subtotal < coupon.minAmount) {
    return NextResponse.json({ valid: false, message: `Monto mínimo: Bs. ${coupon.minAmount.toFixed(2)}` });
  }

  return NextResponse.json({
    valid: true,
    discount: coupon.discount,
    code: coupon.code,
  });
}
