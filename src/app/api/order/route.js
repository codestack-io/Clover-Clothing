import { dbConnect, Collection } from "@/app/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const collection = await dbConnect(Collection.ORDER);

    const orders = await collection
      .find({ email: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return new Response(JSON.stringify({ success: true, orders }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const { paymentId, paymentMethod } = body;

    const result = await createOrder({
      paymentId,
      paymentMethod,
    });

    return NextResponse.json({
      success: true,
      order: result,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}