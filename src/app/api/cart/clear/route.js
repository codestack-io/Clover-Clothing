import { NextResponse } from "next/server";
import { dbConnect, Collection } from "@/app/lib/dbConnect";
import { getserverSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

export async function DELETE() {
  try {
    const session = await getserverSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const collection = await dbConnect(Collection.CART);

    await collection.deleteMany({
      "user.email": session.user.email,
    });

    return NextResponse.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.error("Clear cart error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}