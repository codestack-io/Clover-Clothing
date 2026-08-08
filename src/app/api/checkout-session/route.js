import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";
import { dbConnect, Collection } from "@/app/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    // =========================
    // AUTHENTICATION
    // =========================

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    // =========================
    // REQUEST BODY
    // =========================

    const { cartItems, orderId } = await req.json();

    console.log("Incoming Stripe body:", {
      cartItems,
      orderId,
    });

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        {
          error: "Cart is empty",
        },
        { status: 400 }
      );
    }

    // =========================
    // ORDER ID
    // =========================

    if (!orderId || !ObjectId.isValid(orderId)) {
      return NextResponse.json(
        {
          error: "Invalid Order ID",
        },
        { status: 400 }
      );
    }

    // =========================
    // FIND ORDER
    // =========================

    const collection = await dbConnect(Collection.ORDER);

    const order = await collection.findOne({
      _id: new ObjectId(orderId),
    });

    if (!order) {
      return NextResponse.json(
        {
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    // =========================
    // STRIPE LINE ITEMS
    // =========================

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",

        product_data: {
          name: item.name || item.title || "Product",
        },

        unit_amount: Math.round(
          (Number(item.price) || 0) * 100
        ),
      },

      quantity: Number(item.quantity) || 1,
    }));

    // =========================
    // ORIGIN
    // =========================

    const origin =
      process.env.NEXT_PUBLIC_BASE_VERCEL_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    console.log("Stripe origin:", origin);

    // =========================
    // CREATE STRIPE SESSION
    // =========================

    const stripeSession =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card"],

        mode: "payment",

        line_items,

        metadata: {
          orderId: order._id.toString(),
          method: "stripe",
        },

        success_url:
          `${origin}/success` +
          `?session_id={CHECKOUT_SESSION_ID}` +
          `&orderId=${order._id.toString()}` +
          `&method=stripe`,

        cancel_url:
          `${origin}/checkout`,

        customer_email:
          session.user.email || undefined,
      });

    console.log(
      "Stripe session created:",
      stripeSession.id
    );

    return NextResponse.json({
      success: true,
      url: stripeSession.url,
    });

  } catch (err) {
    console.error("🔥 STRIPE ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        error:
          err?.message ||
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}