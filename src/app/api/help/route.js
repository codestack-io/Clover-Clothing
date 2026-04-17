import { NextResponse } from "next/server";
import { dbConnect, Collection } from "@/app/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptionss } from "@/app/lib/nextauth";

// GET all questions (admin) or user-specific questions
export async function GET(req) {
  try {
    const session = await getServerSession(authOptionss);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const collection = await dbConnect(Collection.HELP);

    let query = {};
    if (session.user.role !== "admin") {
      // normal user sees only their questions
      query.email = session.user.email;
    }

    const questions = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(questions);
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}

// PATCH to answer a question (admin only)
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptionss);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params; // dynamic route /api/help/[id]
    const { answer } = await req.json();

    if (!answer) {
      return NextResponse.json({ message: "Answer required" }, { status: 400 });
    }

    const collection = await dbConnect(Collection.HELP);

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { answer, status: "answered" } }
    );

    console.log("Update Result:", result);

    return NextResponse.json({ message: "Answered successfully" });
  } catch (error) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}