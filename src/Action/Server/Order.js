"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { sendEmail } from "../../app/lib/sendEmail";
import { clearCart } from "@/action/server/cart"; // ✅ single import
import { generateInvoiceHTML } from "../../app/lib/orderInvoice";
import { ObjectId } from "mongodb";

const { dbConnect, Collection } = require("@/app/lib/dbConnect");

export const createOrder = async (payload) => {
  const { user, items } = payload;
  if (!user || !user.email) return { success: false };
  if (!items || items.length === 0) return { success: false };

  const products = items.map((item) => ({
    _id: new ObjectId(item.productId || item._id),
    quantity: item.quantity,
  }));

  const orderCollection = await dbConnect(Collection.ORDER);

  const newOrder = {
    createdAt: new Date(),
    items,
    user,
    email: user.email,
    ...payload
  };

  const result = await orderCollection.insertOne(newOrder);
  if (!result.insertedId) return { success: false };
  // ✅ CLEAR CART AFTER ORDER CREATED
const cartCollection = await dbConnect(Collection.CART);
await cartCollection.deleteMany({ email: user.email });



  // Update sold count
  const productCollection = await dbConnect(Collection.PRODUCTS);
  const operations = products.map((item) => ({
    updateOne: { filter: { _id: item._id }, update: { $inc: { sold: item.quantity } } }
  }));
  await productCollection.bulkWrite(operations);

  // Clear cart
  try {
  await clearCart();
} catch (err) {
  console.error("Failed to clear cart:", err);
} // ✅ this uses the imported function

  const insertedOrder = {
    ...newOrder,
    _id: result.insertedId.toString(),
    createdAt: newOrder.createdAt.toISOString()
  };

  // Send invoice
  await sendEmail({
    to: insertedOrder.user.email,
    subject: "Your Order Invoice",
    html: generateInvoiceHTML(insertedOrder)
  });

  return { success: true, order: insertedOrder };
};