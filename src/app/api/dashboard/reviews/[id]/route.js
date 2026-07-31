import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";

// -----------------------------------------
// UPDATE REVIEW STATUS
// -----------------------------------------

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review ID",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const { status } = body;

    if (
      !["pending", "approved", "rejected"].includes(
        status
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review status",
        },
        {
          status: 400,
        }
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
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Review ${status} successfully`,
    });
  } catch (error) {
    console.error("Review PATCH Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update review",
      },
      {
        status: 500,
      }
    );
  }
}

// -----------------------------------------
// DELETE REVIEW
// -----------------------------------------

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review ID",
        },
        {
          status: 400,
        }
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
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Review DELETE Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete review",
      },
      {
        status: 500,
      }
    );
  }
}