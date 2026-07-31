import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";
import Review from "@/models/Review";

// -----------------------------------------
// GET REVIEWS
// -----------------------------------------

export async function GET() {
  try {
    await connectDB();

    const db = mongoose.connection.db;

    const reviewsCollection = db.collection("reviews");

    const reviews = await reviewsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const totalReviews = reviews.length;

    const approvedReviews = reviews.filter(
      (review) => review.status === "approved"
    ).length;

    const pendingReviews = reviews.filter(
      (review) => review.status === "pending"
    ).length;

    const rejectedReviews = reviews.filter(
      (review) => review.status === "rejected"
    ).length;

    const ratingTotal = reviews.reduce(
      (total, review) =>
        total + (Number(review.rating) || 0),
      0
    );

    const averageRating =
      totalReviews > 0
        ? ratingTotal / totalReviews
        : 0;

    return NextResponse.json({
      success: true,

      stats: {
        totalReviews,
        approvedReviews,
        pendingReviews,
        rejectedReviews,
        averageRating,
      },

      reviews: reviews.map((review) => ({
        id: review._id.toString(),

        customerName:
          review.customerName || "Anonymous",

        customerEmail:
          review.customerEmail || "",

        productId:
          review.productId?.toString() || null,

        productName:
          review.productName || "Product",

        rating:
          Number(review.rating) || 0,

        comment:
          review.comment || "",

        status:
          review.status || "pending",

        createdAt:
          review.createdAt || null,
      })),
    });
  } catch (error) {
    console.error("Reviews GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load reviews",
      },
      {
        status: 500,
      }
    );
  }
}

// -----------------------------------------
// CREATE REVIEW
// -----------------------------------------

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      customerName,
      customerEmail,
      productId,
      productName,
      rating,
      comment,
    } = body;

    if (
      !customerName ||
      !customerEmail ||
      !productName ||
      !rating ||
      !comment
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields must be provided",
        },
        {
          status: 400,
        }
      );
    }

    const numericRating = Number(rating);

    if (
      numericRating < 1 ||
      numericRating > 5
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Rating must be between 1 and 5",
        },
        {
          status: 400,
        }
      );
    }

    const db = mongoose.connection.db;

    const review = {
      customerName: customerName.trim(),

      customerEmail:
        customerEmail.trim().toLowerCase(),

      productId: productId
        ? new mongoose.Types.ObjectId(productId)
        : null,

      productName: productName.trim(),

      rating: numericRating,

      comment: comment.trim(),

      status: "pending",

      createdAt: new Date(),

      updatedAt: new Date(),
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
          productId:
            review.productId?.toString() || null,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Reviews POST Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create review",
      },
      {
        status: 500,
      }
    );
  }
}