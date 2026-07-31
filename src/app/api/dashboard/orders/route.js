import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";

export async function GET() {
  try {
    const mongoose = await connectDB();
    const db = mongoose.connection.db;

    const orders = await db
      .collection("order")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedOrders = orders.map((order) => ({
      id: order._id.toString(),

      customer:
        order.user?.email ||
        order.email ||
        "Guest",

      totalPrice: Number(order.totalPrice) || 0,

      status: order.status || "pending",

      deliveryStatus:
        order.deliveryStatus || "pending",

      paymentMethod:
        order.paymentMethod || "N/A",

      phone: order.phone || "",

      address: order.address || "",

      city: order.city || "",

      postalCode: order.postalCode || "",

      paymentId: order.paymentId || "",

      items: Array.isArray(order.items)
        ? order.items
        : [],

      createdAt: order.createdAt || null,
    }));

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      total: formattedOrders.length,
    });
  } catch (error) {
    console.error("Orders API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load orders",
      },
      { status: 500 }
    );
  }
}