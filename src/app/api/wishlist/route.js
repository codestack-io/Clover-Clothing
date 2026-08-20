import { dbConnect, Collection } from "../../../app/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../app/lib/authOptions";

// ==========================
// GET USER WISHLIST
// ==========================

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const collection = await dbConnect(Collection.WISHLIST);

    const wishlist = await collection
      .find({
        email: session.user.email,
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("GET WISHLIST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ==========================
// ADD PRODUCT TO WISHLIST
// ==========================

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      productId,
      name,
      price,
      image,
      quantity,
    } = body;

    // ==========================
    // VALIDATE PRODUCT ID
    // ==========================

    if (!productId || !ObjectId.isValid(productId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product ID",
        },
        { status: 400 }
      );
    }

    // ==========================
    // REQUIRED PRODUCT DATA
    // ==========================

    if (!name || price === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Product name and price are required",
        },
        { status: 400 }
      );
    }

    const collection = await dbConnect(Collection.WISHLIST);

    // ==========================
    // CHECK IF ALREADY EXISTS
    // ==========================

    const existingItem = await collection.findOne({
      email: session.user.email,
      productId: productId,
    });

    if (existingItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Product is already in wishlist",
        },
        { status: 409 }
      );
    }

    // ==========================
    // CREATE WISHLIST ITEM
    // ==========================

    const wishlistItem = {
      email: session.user.email,

      user: {
        name: session.user.name || "",
        email: session.user.email,
      },

      productId,
      name,
      price: Number(price),
      image: image || "",
      quantity: Number(quantity) || 1,

      createdAt: new Date(),
    };

    const result = await collection.insertOne(wishlistItem);

    const createdItem = await collection.findOne({
      _id: result.insertedId,
    });

    return NextResponse.json(
      {
        success: true,
        wishlistItem: createdItem,
        message: "Product added to wishlist",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADD WISHLIST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ==========================
// REMOVE PRODUCT FROM WISHLIST
// ==========================

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);

    const productId = searchParams.get("productId");

    if (!productId || !ObjectId.isValid(productId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product ID",
        },
        { status: 400 }
      );
    }

    const collection = await dbConnect(Collection.WISHLIST);

    const result = await collection.deleteOne({
      email: session.user.email,
      productId: productId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found in wishlist",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error("DELETE WISHLIST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}