import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();

    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("Database connection not available");
    }

    const reviews = await db
      .collection("reviews")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      reviews: reviews.map((review) => ({
        id: review._id.toString(),
        customer:
          review.customer ||
          review.username ||
          review.name ||
          "Anonymous",
        email: review.email || "",
        product:
          review.product ||
          review.productName ||
          "Unknown Product",
        productId: review.productId
          ? review.productId.toString()
          : null,
        rating: Number(review.rating) || 0,
        comment:
          review.comment ||
          review.review ||
          "",
        status: review.status || "pending",
        createdAt: review.createdAt || null,
      })),
    });
  } catch (error) {
    console.error("Reviews GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load reviews",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      customer,
      email,
      product,
      productId,
      rating,
      comment,
    } = body;

    if (!customer || !comment || !rating) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer, rating and comment are required",
        },
        { status: 400 }
      );
    }

    const numericRating = Number(rating);

    if (numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Rating must be between 1 and 5",
        },
        { status: 400 }
      );
    }

    const db = mongoose.connection.db;

    const review = {
      customer: customer.trim(),
      email: email?.trim() || "",
      product: product?.trim() || "Unknown Product",
      productId: productId || null,
      rating: numericRating,
      comment: comment.trim(),
      status: "pending",
      createdAt: new Date(),
    };

    const result = await db
      .collection("reviews")
      .insertOne(review);

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully",
        review: {
          id: result.insertedId.toString(),
          ...review,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Reviews POST Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create review",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "Review ID and status are required",
        },
        { status: 400 }
      );
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review status",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review ID",
        },
        { status: 400 }
      );
    }

    const db = mongoose.connection.db;

    const result = await db
      .collection("reviews")
      .updateOne(
        {
          _id: new mongoose.Types.ObjectId(id),
        },
        {
          $set: {
            status,
            updatedAt: new Date(),
          },
        }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review status updated",
    });
  } catch (error) {
    console.error("Reviews PATCH Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update review",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Review ID is required",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review ID",
        },
        { status: 400 }
      );
    }

    const db = mongoose.connection.db;

    const result = await db
      .collection("reviews")
      .deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Reviews DELETE Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete review",
      },
      { status: 500 }
    );
  }
}