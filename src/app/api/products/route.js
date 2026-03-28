import { dbConnect, Collection } from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cottonType = searchParams.get("cottonType");

    const collection = await dbConnect(Collection.PRODUCTS);

    let query = {};
    if (cottonType) {
      query.cottonType = cottonType;
    }

    const products = await collection.find(query).toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}