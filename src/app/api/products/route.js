// app/api/products/route.js
import { dbConnect, Collection } from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const cottonType = searchParams.get("cottonType");

    const collection = await dbConnect(Collection.PRODUCTS);

    let query = {};
    if (cottonType) {
      query.cottonType = cottonType;  // ✅ match field name in MongoDB
    }

    const products = await collection.find(query).toArray(); // ✅ use query object

    return NextResponse.json(products);
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}