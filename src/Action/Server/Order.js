"use server";

import { ObjectId } from "mongodb";
import { sendEmail } from "@/app/lib/sendEmail";
import { generateInvoiceHTML } from "../../app/lib/orderInvoice";

const { dbConnect, Collection } = require("@/app/lib/dbConnect");

export const createOrder = async (payload) => {
  const { user, items } = payload;

  if (!user || !user.email) return { success: false };
  if (!items || items.length === 0) return { success: false };

  const orderCollection = await dbConnect(Collection.ORDER);
  const productCollection = await dbConnect(Collection.PRODUCTS);

  // 1. Create order
  const newOrder = {
    createdAt: new Date(),
    items,
    user,
    email: user.email,
    ...payload,
  };

  const result = await orderCollection.insertOne(newOrder);

  if (!result.insertedId) return { success: false };

  // 2. FIXED SOLD UPDATE (IMPORTANT FIX)
  const operations = items.map((item) => {
  const id = item.productId;

  return {
    updateOne: {
      filter: { _id: new ObjectId(item.productId) },
      update: {
        $inc: { sold: Number(item.quantity) },
      },
    },
  };
});

 await productCollection.bulkWrite(operations);

console.log("UPDATED SOLD:", result);

  

  // 3. Clear cart (ONLY ONCE)
  const cartCollection = await dbConnect(Collection.CART);
  await cartCollection.deleteMany({ email: user.email });
   
 

  // // 4. Send invoice
  // const insertedOrder = {
  //   ...newOrder,
  //   _id: result.insertedId.toString(),
  //   createdAt: newOrder.createdAt.toISOString(),
  // };

  // await sendEmail({
  //   to: user.email,
  //   subject: "Your Order Invoice",
  //   html: generateInvoiceHTML(insertedOrder),
  // });

  return { success: true, order: insertedOrder };
};