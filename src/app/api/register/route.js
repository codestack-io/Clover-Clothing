import { NextResponse } from "next/server";
import { dbConnect, Collection } from "../../../app/lib/dbConnect";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();

    const { name, email, password, image } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const users = await dbConnect(Collection.USERS);

    const exists = await users.findOne({ email });

    if (exists) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      image: image || "https://i.ibb.co/4pDNDk1/avatar.png",
      provider: "credentials",
      role: "user",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Registration failed." },
      { status: 500 }
    );
  }
}