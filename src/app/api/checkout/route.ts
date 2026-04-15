import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { items } = await req.json();

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Verify products exist and build line items
  const productIds = items.map((i: { id: string }) => i.id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const lineItems = items.map((item: { id: string; name: string; quantity: number }) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) throw new Error(`Product ${item.id} not found`);
    return {
      price_data: {
        currency: "bob",
        product_data: {
          name: product.name,
          ...(product.image ? { images: [product.image] } : {}),
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    metadata: {
      productIds: JSON.stringify(items.map((i: { id: string; quantity: number }) => ({ id: i.id, qty: i.quantity }))),
    },
  });

  return NextResponse.json({ url: session.url });
}
