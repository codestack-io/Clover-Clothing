import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";

export async function GET() {
  try {
    const mongoose = await connectDB();
    const db = mongoose.connection.db;

    const products = await db
      .collection("products")
      .find({})
      .sort({ _id: -1 })
      .toArray();

    const formattedProducts = products.map((product) => ({
      id: product._id.toString(),
      name: product.name || "Unnamed Product",
      image: product.image || "",
      price: Number(product.price) || 0,
      brand: product.brand || "",
      cottonType: product.cottonType || "",
      size: product.size || "",
      color: product.color || "",
      sold: Number(product.sold) || 0,
    }));

    return NextResponse.json({
      success: true,
      products: formattedProducts,
      total: formattedProducts.length,
    });
  } catch (error) {
    console.error("Products API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load products",
      },
      { status: 500 }
    );
  }
}