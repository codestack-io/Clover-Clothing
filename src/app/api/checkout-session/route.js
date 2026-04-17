import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";
import { dbConnect, Collection } from "@/app/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { cartItems, orderId } = await req.json();
    console.log("Incoming body:", { cartItems, orderId });

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const collection = await dbConnect(Collection.ORDER);
    const order = await collection.findOne({ _id: new ObjectId(orderId) });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.title },
        unit_amount: Math.round((Number(item.price) || 0) * 100),
      },
      quantity: item.quantity,
    }));

    const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      metadata: { orderId: order._id.toString(),method:"stripe" },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&orderId=${order._id}&method=stripe`,
      cancel_url: `${origin}/checkout`,
      customer_email: session.user.email,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (err) {
    console.error("🔥 Stripe Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server Error" },
      { status: 500 }
    );
  }
}