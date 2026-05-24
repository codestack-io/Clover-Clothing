import { dbConnect, Collection } from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { sendEmail } from "@/app/lib/sendEmail";
import { generateInvoiceHTML } from "@/app/lib/orderInvoice";
import { authOptions } from "@/app/lib/authOptions";
import { getServerSession } from "next-auth";

// ======================
// GET USER ORDERS
// ======================

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const collection = await dbConnect(Collection.ORDER);

    const orders = await collection
      .find({ "user.email": session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("GET ORDER ERROR:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ======================
// CREATE ORDER / PAYMENT UPDATE
// ======================

export async function POST(req) {
  try {
    const body = await req.json();

    const orderCollection = await dbConnect(Collection.ORDER);

    const {
      orderId,
      paymentId,
      paymentMethod,
      items,
      totalPrice,
      phone,
      address,
      city,
      postalCode,
      user,
    } = body;

    // ============================
    // PAYMENT SUCCESS FLOW
    // ============================

    if (orderId) {
      if (!ObjectId.isValid(orderId)) {
        return NextResponse.json(
          { success: false, error: "Invalid Order ID" },
          { status: 400 }
        );
      }

      const existingOrder = await orderCollection.findOne({
        _id: new ObjectId(orderId),
      });

      if (!existingOrder) {
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 }
        );
      }

      // 1. Update order payment status
      await orderCollection.updateOne(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            status: "paid",
            paymentId: paymentId || "",
            paymentMethod: paymentMethod || "stripe",
            deliveryStatus: "processing",
            paidAt: new Date(),
          },
        }
      );

      const updatedOrder = await orderCollection.findOne({
        _id: new ObjectId(orderId),
      });

      // ============================
      // UPDATE SOLD COUNT
      // ============================

      const productCollection = await dbConnect(Collection.PRODUCTS);

      const safeItems = updatedOrder.items || [];

      for (const item of safeItems) {
        await productCollection.updateOne(
          { _id: new ObjectId(item.productId) },
          {
            $inc: { sold: Number(item.quantity) },
          }
        );
      }

      // ============================
      // CLEAR CART (🔥 ADDED HERE)
      // ============================

      const cartCollection = await dbConnect(Collection.CART);

      await cartCollection.deleteMany({
        email: updatedOrder.user.email,
      });

      console.log("🧹 Cart cleared for:", updatedOrder.user.email);

      // ============================
      // SEND EMAIL
      // ============================

      try {
        const invoiceHTML = generateInvoiceHTML({
          ...updatedOrder,
          _id: updatedOrder._id.toString(),
        });

        await sendEmail({
          to: updatedOrder.user.email,
          subject: `Invoice for Order #${updatedOrder._id}`,
          html: invoiceHTML,
        });

        console.log("✅ Invoice email sent");
      } catch (emailError) {
        console.error("❌ Email sending failed:", emailError);
      }

      return NextResponse.json({
        success: true,
        message: "Payment successful, cart cleared & invoice sent",
        orderId: updatedOrder._id,
      });
    }

    // ============================
    // CREATE ORDER (PENDING)
    // ============================

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    const newOrder = {
      user,
      items,
      totalPrice,
      phone,
      address,
      city,
      postalCode,
      paymentMethod: "pending",
      paymentId: "",
      status: "pending",
      deliveryStatus: "pending",
      createdAt: new Date(),
    };

    const result = await orderCollection.insertOne(newOrder);

    const createdOrder = await orderCollection.findOne({
      _id: result.insertedId,
    });

    return NextResponse.json({
      success: true,
      order: createdOrder,
      orderId: result.insertedId.toString(),
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("🔥 ORDER API ERROR:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}