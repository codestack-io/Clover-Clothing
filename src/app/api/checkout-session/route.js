import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function POST(req) {
  try {
    const body = await req.json();
    const { cartItems } = body;

    // ✅ Validate cart
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // ✅ FIX: headers() is NOT async
    const headersList = headers();
    const origin = headersList.get("origin") || "http://localhost:3000";

    // ✅ FIX: correct item fields
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title || "Product",
        },
        unit_amount: Math.round(item.price * 100), // safer
      },
      quantity: item.quantity || 1,
    }));

    // ✅ Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error("🔥 Stripe Error:", err);

    return NextResponse.json(
      {
        error: err.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}