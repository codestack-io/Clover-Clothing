import { ObjectId } from "mongodb";
import { dbConnect, Collection } from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const { id } = await context.params;

    console.log("Received ID:", id); // ✅ DEBUG

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID" },
        { status: 400 }
      );
    }

    const collection = await dbConnect(Collection.ORDER);

    const order = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}