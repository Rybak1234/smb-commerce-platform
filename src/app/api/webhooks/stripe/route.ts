import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customer = session.customer_details;
    const meta = session.metadata;

    if (meta?.productIds) {
      const cartItems: { id: string; qty: number }[] = JSON.parse(meta.productIds);
      const products = await prisma.product.findMany({
        where: { id: { in: cartItems.map((i) => i.id) } },
      });

      const total = cartItems.reduce((sum, ci) => {
        const p = products.find((pr) => pr.id === ci.id);
        return sum + (p ? p.price * ci.qty : 0);
      }, 0);

      await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            customerEmail: customer?.email || "unknown@email.com",
            customerName: customer?.name || "Cliente",
            status: "paid",
            total,
            stripeSessionId: session.id,
            items: {
              create: cartItems.map((ci) => {
                const p = products.find((pr) => pr.id === ci.id)!;
                return {
                  productId: ci.id,
                  quantity: ci.qty,
                  price: p.price,
                };
              }),
            },
          },
        });

        // Decrease stock
        for (const ci of cartItems) {
          await tx.product.update({
            where: { id: ci.id },
            data: { stock: { decrement: ci.qty } },
          });
        }

        return order;
      });
    }
  }

  return NextResponse.json({ received: true });
}
