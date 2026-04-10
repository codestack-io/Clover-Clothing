import { NextResponse } from "next/server";
import { dbConnect, Collection } from "@/app/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
  }

  try {
    const collection = await dbConnect(Collection.ORDER);
    const order = await collection.findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("🔥 GET order error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}