import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";

/**
 * GET /api/dashboard/products
 * Fetch all products
 */
export async function GET() {
  try {
    await connectDB();

    const db = mongoose.connection.db;

    const products = await db
      .collection("products")
      .find({})
      .sort({ _id: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      products: products.map((product) => ({
        id: product._id.toString(),
        productId: product.id || null,
        name: product.name || "",
        image: product.image || "",
        cottonType: product.cottonType || "",
        brand: product.brand || "",
        size: product.size || "",
        color: product.color || "",
        price: Number(product.price) || 0,
        sold: Number(product.sold) || 0,
      })),
    });
  } catch (error) {
    console.error("Products GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load products",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/dashboard/products
 * Create a new product
 */
export async function POST(request) {
  try {
    await connectDB();

    const db = mongoose.connection.db;

    const body = await request.json();

    const {
      name,
      image,
      cottonType,
      brand,
      size,
      color,
      price,
      sold,
    } = body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name is required",
        },
        { status: 400 }
      );
    }

    if (price === undefined || price === "" || Number(price) < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid product price is required",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // GENERATE PRODUCT ID
    // -----------------------------

    const lastProduct = await db
      .collection("products")
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    const nextId =
      lastProduct.length > 0 && Number(lastProduct[0].id)
        ? Number(lastProduct[0].id) + 1
        : 1;

    // -----------------------------
    // CREATE PRODUCT
    // -----------------------------

    const newProduct = {
      id: nextId,
      name: name.trim(),
      image: image?.trim() || "",
      cottonType: cottonType?.trim() || "",
      brand: brand?.trim() || "",
      size: size?.trim() || "",
      color: color?.trim() || "",
      price: Number(price),
      sold: Number(sold) || 0,
    };

    const result = await db
      .collection("products")
      .insertOne(newProduct);

    return NextResponse.json(
      {
        success: true,
        message: "Product added successfully",
        product: {
          id: result.insertedId.toString(),
          ...newProduct,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Products POST Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add product",
      },
      { status: 500 }
    );
  }
}