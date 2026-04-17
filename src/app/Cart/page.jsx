import { getCart } from "@/action/server/cart";
import CartItem from "@/components/Card/CartItem";
import Cart from "@/components/Home/Cart";
import React from "react";

const CartPage = async () => {
  try {
    const cartItems = await getCart();

    const formattedItems = cartItems.map(item => ({
      ...item,
      _id: item._id.toString()
    }));

   return (
  <div className="max-w-5xl mx-auto p-5">
    <h1 className="text-2xl font-bold mb-5">Your Cart</h1>

    {formattedItems.length === 0 ? (
      <p>No items in cart</p>
    ) : (
      formattedItems.map(item => (
        <CartItem key={item._id} item={item} />
      ))
    )}
  </div>
);
  } catch (error) {
    console.error("Cart error:", error);
    return <div>Error loading cart</div>;
  }
};
export default CartPage;