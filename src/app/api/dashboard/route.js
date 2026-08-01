import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";

export async function GET() {
  try {
    // Connect MongoDB
    const mongoose = await connectDB();
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("MongoDB database connection is not available");
    }

    // Collections
    const productsCollection = db.collection("products");
    const ordersCollection = db.collection("order"); // Change to "orders" if needed
    const usersCollection = db.collection("users");

    // --------------------------------
    // BASIC COUNTS
    // --------------------------------

    const totalProducts = await productsCollection.countDocuments();
    const totalOrders = await ordersCollection.countDocuments();
    const totalCustomers = await usersCollection.countDocuments();

    // --------------------------------
    // TOTAL REVENUE
    // --------------------------------

    const revenueResult = await ordersCollection
      .aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $convert: {
                  input: "$totalPrice",
                  to: "double",
                  onError: 0,
                  onNull: 0,
                },
              },
            },
          },
        },
      ])
      .toArray();

    const revenue = revenueResult[0]?.total || 0;

    // --------------------------------
    // SALES OVERVIEW
    // --------------------------------

    const salesData = await ordersCollection
      .aggregate([
        {
          $group: {
            _id: {
              month: {
                $dateToString: {
                  format: "%b",
                  date: "$createdAt",
                },
              },
            },
            sales: {
              $sum: {
                $convert: {
                  input: "$totalPrice",
                  to: "double",
                  onError: 0,
                  onNull: 0,
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id.month",
            sales: 1,
          },
        },
      ])
      .toArray();

    // --------------------------------
    // RECENT ORDERS
    // --------------------------------

    const recentOrders = await ordersCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // --------------------------------
    // LATEST PRODUCTS
    // --------------------------------

    const latestProducts = await productsCollection
      .find({})
      .sort({ _id: -1 })
      .limit(5)
      .toArray();

    // --------------------------------
    // BEST SELLING PRODUCTS
    // --------------------------------

    const bestSelling = await productsCollection
      .find({})
      .sort({ sold: -1 })
      .limit(5)
      .toArray();

    // --------------------------------
    // RESPONSE
    // --------------------------------

    return NextResponse.json({
      success: true,

      stats: {
        totalProducts,
        totalOrders,
        revenue,
        totalCustomers,
      },

      salesData,

      bestSelling: bestSelling.map((product) => ({
        name: product.name || "Unnamed Product",
        sold: Number(product.sold) || 0,
      })),

      recentOrders: recentOrders.map((order) => ({
        id: order._id.toString(),
        customer: order.user?.email || "Guest",
        amount: Number(order.totalPrice) || 0,
        paymentStatus: order.status || "Pending",
        deliveryStatus: order.deliveryStatus || "Pending",
        createdAt: order.createdAt || null,
      })),

      latestProducts: latestProducts.map((product) => ({
        id: product._id.toString(),
        name: product.name || "Unnamed Product",
        price: Number(product.price) || 0,
        image: product.image || "",
        category: product.cottonType || "Product",
        sold: Number(product.sold) || 0,
      })),
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to load dashboard data",
      },
      {
        status: 500,
      }
    );
  }
}