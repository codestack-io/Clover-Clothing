// /app/api/auth/login/route.js
import { dbConnect, Collection } from "../../../../app/lib/dbConnect";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, message: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const collection = await dbConnect(Collection.USERS);
    const user = await collection.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Login successful
    return new Response(
      JSON.stringify({ success: true, message: "Login successful" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Login error:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}