"use client";

import React from "react";
import CheckoutForm from "../../components/Home/CheckoutForm";
import useCartStore from "../../store/cartStore";

const CheckoutPage = () => {
  const cartItems = useCartStore((state) => state.cart);

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <CheckoutForm cartItems={cartItems} />
    </main>
  );
};

export default CheckoutPage;