import { dbConnect, Collection } from "../../lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

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

    // Serialize ObjectId for client
    const serialized = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, shortDescription, description, price, cottonType, color, image, discount } = body;

    if (!name || !price || !cottonType) {
      return NextResponse.json(
        { error: "name, price, and cottonType are required" },
        { status: 400 }
      );
    }

    const collection = await dbConnect(Collection.PRODUCTS);

    const newProduct = {
      name,
      shortDescription: shortDescription || "",
      description: description || "",
      price: Number(price),
      cottonType,
      color: color || "",
      image: image || "",
      discount: Number(discount) || 0,
      sold: 0,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newProduct);

    return NextResponse.json(
      { message: "Product added successfully", id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || id.length !== 24) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const collection = await dbConnect(Collection.PRODUCTS);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
