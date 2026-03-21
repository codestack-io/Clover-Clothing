"use server"

import { clearCart, getCart } from "./cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { sendEmail } from "../../app/lib/sendEmail";


import { generateInvoiceHTML } from "../../app/lib/orderInvoice";
import { ObjectId } from "mongodb";

const { dbConnect, Collection } = require("@/app/lib/dbConnect");

export const createOrder = async (payload) => {

  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) return { success: false };

  const cart = await getCart();
  if (cart.length === 0) {
    return { success: false };
  }
  const products = cart.map((item)=>({
    _id: new ObjectId(item.productId),
    quantity:item.quantity
  }));
  

  // get the real MongoDB collection
  const orderCollection = await dbConnect(Collection.ORDER);

  const newOrder = {
    createdAt: new Date(),
    items: cart,
    user,
    email: user.email,
    ...payload
  };

  if (!user?.email) return { success: false };
  console.log(await orderCollection.find({}).toArray());
  // insert order
  const result = await orderCollection.insertOne(newOrder);

  if (Boolean(result.insertedId)) {

    // ✅ Update sold count
    const productCollection = await dbConnect(Collection.PRODUCTS);

    const operations = products.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $inc: { sold: item.quantity } }
      }
    }));

    await productCollection.bulkWrite(operations);

    // ✅ clear cart
    await clearCart();
  }

 const insertedOrder = { ...newOrder, _id: result.insertedId };

await sendEmail({
  to: insertedOrder.user.email,
  subject: "Your Order Invoice",
  html: generateInvoiceHTML(insertedOrder)
});

  return {
    success: Boolean(result.insertedId)
  };
};