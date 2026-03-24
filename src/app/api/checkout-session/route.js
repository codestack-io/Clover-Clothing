import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("BODY:", body); // 👈 DEBUG

    const { cartItems } = body;

    // ❌ If empty → error
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

  const headersList = await headers();
const origin = headersList.get("origin");

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name || "Product",
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}