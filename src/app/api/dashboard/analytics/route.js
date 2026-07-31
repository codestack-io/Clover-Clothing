import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();

    const db = mongoose.connection.db;

    const ordersCollection = db.collection("order");
    const productsCollection = db.collection("products");

    // -----------------------------------------
    // TOTALS
    // -----------------------------------------

    const totalOrders = await ordersCollection.countDocuments();

    const totalProducts = await productsCollection.countDocuments();

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

    const totalRevenue = revenueResult[0]?.total || 0;

    // -----------------------------------------
    // AVERAGE ORDER VALUE
    // -----------------------------------------

    const averageOrderValue =
      totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // -----------------------------------------
    // MONTHLY SALES
    // -----------------------------------------

    const monthlySales = await ordersCollection
      .aggregate([
        {
          $match: {
            createdAt: { $exists: true },
          },
        },
        {
          $addFields: {
            convertedDate: {
              $convert: {
                input: "$createdAt",
                to: "date",
                onError: null,
                onNull: null,
              },
            },
          },
        },
        {
          $match: {
            convertedDate: { $ne: null },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$convertedDate" },
              month: { $month: "$convertedDate" },
            },
            revenue: {
              $sum: {
                $convert: {
                  input: "$totalPrice",
                  to: "double",
                  onError: 0,
                  onNull: 0,
                },
              },
            },
            orders: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ])
      .toArray();

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const salesData = monthlySales.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: Number(item.revenue) || 0,
      orders: item.orders || 0,
    }));

    // -----------------------------------------
    // ORDER STATUS
    // -----------------------------------------

    const orderStatuses = await ordersCollection
      .aggregate([
        {
          $group: {
            _id: {
              $ifNull: ["$status", "pending"],
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ])
      .toArray();

    const statusData = orderStatuses.map((item) => ({
      name: item._id,
      value: item.count,
    }));

    // -----------------------------------------
    // DELIVERY STATUS
    // -----------------------------------------

    const deliveryStatuses = await ordersCollection
      .aggregate([
        {
          $group: {
            _id: {
              $ifNull: ["$deliveryStatus", "pending"],
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ])
      .toArray();

    const deliveryData = deliveryStatuses.map((item) => ({
      name: item._id,
      value: item.count,
    }));

    // -----------------------------------------
    // BEST SELLING PRODUCTS
    // -----------------------------------------

    const bestProducts = await productsCollection
      .find({})
      .sort({ sold: -1 })
      .limit(8)
      .toArray();

    const bestSellingProducts = bestProducts.map((product) => ({
      name: product.name || "Unnamed Product",
      sold: Number(product.sold) || 0,
      revenue:
        (Number(product.price) || 0) * (Number(product.sold) || 0),
    }));

    // -----------------------------------------
    // PRODUCT CATEGORY / COTTON TYPE
    // -----------------------------------------

    const categoryResult = await productsCollection
      .aggregate([
        {
          $group: {
            _id: {
              $ifNull: ["$cottonType", "Product"],
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ])
      .toArray();

    const categoryData = categoryResult.map((item) => ({
      name: item._id,
      value: item.count,
    }));

    // -----------------------------------------
    // RESPONSE
    // -----------------------------------------

    return NextResponse.json({
      success: true,

      overview: {
        totalOrders,
        totalProducts,
        totalRevenue,
        averageOrderValue,
      },

      salesData,

      statusData,

      deliveryData,

      bestSellingProducts,

      categoryData,
    });
  } catch (error) {
    console.error("Analytics API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load analytics data",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}