import { getCart } from "@/action/server/cart";
import cartItems from "@/components/Card/CartItem";
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
  <div className="max-w-7xl mx-auto">
    <Cart cartItems={formattedItems} />
  </div>
);
  } catch (error) {
    console.error("Cart error:", error);
    return <div>Error loading cart</div>;
  }
};
export default CartPage;