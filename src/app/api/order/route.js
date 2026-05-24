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
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const collection = await dbConnect(Collection.ORDER);

    const orders = await collection
      .find({
        "user.email": session.user.email,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET ORDER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ======================
// CREATE ORDER / UPDATE PAYMENT
// ======================

export async function POST(req) {
  try {
    const body = await req.json();

    const collection = await dbConnect(Collection.ORDER);

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

    // =====================================================
    // PAYMENT SUCCESS → UPDATE ORDER + SEND INVOICE EMAIL
    // =====================================================

    if (orderId) {
      // Validate order id

      if (!ObjectId.isValid(orderId)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid Order ID",
          },
          { status: 400 }
        );
      }

      // Find existing order

      const existingOrder = await collection.findOne({
        _id: new ObjectId(orderId),
      });

      if (!existingOrder) {
        return NextResponse.json(
          {
            success: false,
            error: "Order not found",
          },
          { status: 404 }
        );
      }

      // Update payment info

      await collection.updateOne(
        {
          _id: new ObjectId(orderId),
        },
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

      // Get updated order

      const updatedOrder = await collection.findOne({
        _id: new ObjectId(orderId),
      });

      // ==========================================
      // SEND INVOICE EMAIL
      // ==========================================

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
        message: "Payment successful & invoice sent",
        orderId: updatedOrder._id,
      });
    }

    // =====================================================
    // CREATE NEW PENDING ORDER
    // =====================================================

    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cart is empty",
        },
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

    console.log("🛒 Creating Order:", newOrder);

    // Insert order

    const result = await collection.insertOne(newOrder);

    // Get created order

    const createdOrder = await collection.findOne({
      _id: result.insertedId,
    });

    console.log("✅ ORDER CREATED:", createdOrder);

    return NextResponse.json({
      success: true,
      order: createdOrder,
      orderId: result.insertedId.toString(),
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("🔥 ORDER API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}