import { NextResponse } from "next/server";
import { dbConnect, Collection } from "@/app/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params; 
    const { answer } = await req.json();

    console.log("ID:", id);
    console.log("Answer:", answer);

    const collection = await dbConnect(Collection.HELP);

    const result = await collection.updateOne(
      { _id: new ObjectId(id) }, 
      {
        $set: {
          answer: answer,
          status: "answered",
        },
      }
    );

    console.log("Matched:", result.matchedCount);
    console.log("Modified:", result.modifiedCount);

    return NextResponse.json({ message: "Updated", result });

  } catch (error) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json(
      { message: "Error updating" },
      { status: 500 }
    );
  }
}