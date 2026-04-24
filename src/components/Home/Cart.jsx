"use client";

import React, { useState, useMemo } from "react";
import CartItem from "../Card/CartItem";
import { useRouter } from "next/navigation";

export default function Cart({ cartItems = [] }) {
  const [items, setItems] = useState(cartItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // total quantity
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  // total price
  const totalPrice = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  // remove cart item (USE CART _id ONLY)
  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  // update quantity (USE CART _id ONLY)
  const updateQuantity = (id, quantity) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  // payment redirect handler
  const handlePaymentClick = async (method) => {
    setIsModalOpen(false);

    if (method === "Stripe") {
      const res = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: items }),
      });

      const data = await res.json();

      if (data.url) window.location.href = data.url;
    }

    if (method === "Bkash") {
      window.location.href = "/payment/bkash";
    }

    if (method === "Nagad") {
      window.location.href = "/payment/nagad";
    }

    if (method === "Cash") {
      window.location.href = "/payment/cash";
    }
  };

  return (
    <div className="max-w-7xl min-h-[80vh] mx-auto px-6 py-10 grid lg:grid-cols-4 gap-8">

      {/* LEFT: CART ITEMS */}
      <div className="lg:col-span-3 space-y-6">
        {items.length === 0 ? (
          <div className="bg-white border rounded-xl p-10 text-center">
            <h3 className="text-xl font-semibold">Your cart is empty</h3>
            <p className="text-gray-500 mt-2">
              Start adding products to continue shopping.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-xl shadow-sm p-4"
            >
              <CartItem
                item={item}
                removeItem={removeItem}
                updateQuantity={updateQuantity}
              />
            </div>
          ))
        )}
      </div>

      {/* RIGHT: SUMMARY */}
      <div className="lg:col-span-1 bg-white border rounded-xl shadow-sm p-6 sticky top-24 h-fit">

        <h3 className="text-xl font-semibold mb-4">
          Order Summary
        </h3>

        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className="p-2 border">{item.title}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">৳{item.price}</td>
                <td className="p-2 border">
                  ৳{item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTALS */}
        <div className="mt-6 flex justify-between">
          <span>Total Items</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between font-bold mt-2">
          <span>Total Price</span>
          <span className="text-green-600">৳{totalPrice}</span>
        </div>

        {/* CHECKOUT */}
        <button
          onClick={() => router.push("/checkout")}
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}