import { dbConnect, Collection } from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; 

import { authOptions } from "@/app/lib/authOptions";
import { getserverSession } from "next-auth";
// GET ORDERS
export async function GET() {
  try {
    const session = await getserverSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const collection = await dbConnect(Collection.ORDER);

    const orders = await collection
      .find({ "user.email": session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST ORDER
export async function POST(req) {
  try {
    const body = await req.json();
    
       const { orderId, paymentId, paymentMethod } = body;

    const collection = await dbConnect(Collection.ORDER);

    if (orderId) {

       if (!ObjectId.isValid(orderId)) {
        return NextResponse.json({ success: false, error: "Invalid orderId" }, { status: 400 });
      }
      // ✅ Update existing order after Stripe payment
      const order = await collection.findOne({ _id: new ObjectId(orderId) });

      if (!order) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }

      await collection.updateOne(
  { _id: new ObjectId(orderId) },
  { $set: { status: "paid", paymentId, paymentMethod, deliveryStatus: "delivered" } }
);
      return NextResponse.json({ success: true, orderId: order._id });
      
    } else {
      // ✅ Create a new pending order BEFORE Stripe checkout
      const { items, totalPrice, phone, address, city, postalCode, user } = body;

      if (!items || items.length === 0) {
        return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
      }
      

      const newOrder = {
        user,
        items,
        totalPrice,
        phone,
        address,
        city,
        postalCode,
        paymentMethod: paymentMethod || "pending",
        status: "pending",
        deliveryStatus: "on_the_way",
        createdAt: new Date(),
      };
      console.log("Sending order:", {
  items,
  totalPrice,
  phone,
  address,
});
      const result = await collection.insertOne(newOrder);
      const createdOrder = await collection.findOne({ _id: result.insertedId });

      

      return NextResponse.json({
        success: true,
        order: createdOrder,

        orderId: result.insertedId.toString(), 
        message: "Order created (pending payment)",
      });
    }
  } catch (error) {
    console.error("🔥 Order POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}