import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../app/lib/authOptions";
import { dbConnect, Collection } from "../../../../app/lib/dbConnect";

// PATCH /api/help/:id  (Admin only)
export async function PATCH(req, { params }) {
  try {
    // 1. Check session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Admin check
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin only" },
        { status: 403 }
      );
    }

    // 3. Get request body
    const body = await req.json();
    const { answer } = body;

    if (!answer || answer.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Answer is required" },
        { status: 400 }
      );
    }

    // 4. DB connection
    const collection = await dbConnect(Collection.HELP);

    // 5. Update question
    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          answer,
          status: "answered",
          answeredAt: new Date(),
        },
      }
    );

    // 6. Check if document was found
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    // 7. Success response
    return NextResponse.json({
      success: true,
      message: "Answer submitted successfully",
    });
  } catch (error) {
    console.error("PATCH /api/help/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}