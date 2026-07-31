import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();

    const db = mongoose.connection.db;

    const usersCollection = db.collection("users");
    const ordersCollection = db.collection("order");

    // Get all users
    const users = await usersCollection
      .find({})
      .sort({ _id: -1 })
      .toArray();

    // Get order information for each customer
    const customers = await Promise.all(
      users.map(async (user) => {
        const email = user.email || "";

        // Find orders belonging to this customer
        const orders = await ordersCollection
          .find({
            $or: [
              { "user.email": email },
              { email: email },
            ],
          })
          .toArray();

        // Calculate total spent
        const totalSpent = orders.reduce((sum, order) => {
          return sum + (Number(order.totalPrice) || 0);
        }, 0);

        return {
          id: user._id.toString(),

          name:
            user.name ||
            user.username ||
            email.split("@")[0] ||
            "Customer",

          email,

          image: user.image || user.picture || "",

          provider: user.provider || "credentials",

          orders: orders.length,

          totalSpent,

          createdAt: user.createdAt || user._id.getTimestamp(),
        };
      })
    );

    return NextResponse.json({
      success: true,
      customers,
      totalCustomers: customers.length,
    });
  } catch (error) {
    console.error("Customers API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load customers",
      },
      {
        status: 500,
      }
    );
  }
}