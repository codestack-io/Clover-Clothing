import { getCart } from "../../../action/server/cart";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cartItems = await getCart();

    return NextResponse.json({
      success: true,
      cartItems,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}