"use client";

import React, { useState, useMemo } from "react";
import CartItem from "../Card/CartItem";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Cart({ cartItems = [] }) {
  const [items, setItems] = useState(cartItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const removeItem = (_id) => {
    setItems((prevItems) => prevItems.filter((item) => item._id !== _id));
  };

  const updateQuantity = (id, q) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, quantity: q } : item
      )
    );
  };

  const handlePaymentClick = async (method) => {
    setIsModalOpen(false); // Close modal

    if (method === "Stripe") {
      // Stripe payment via API
      const res = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: items }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } else if (method === "Bkash") {
      window.location.href = "/payment/bkash";
    } else if (method === "Nagad") {
      window.location.href = "/payment/nagad";
    } else if (method === "Cash") {
      window.location.href = "/payment/cash";
    }
  };

  return (
    <div className="max-w-7xl min-h-[80vh] mx-auto px-6 py-10 grid lg:grid-cols-4 gap-8">
      {/* LEFT SIDE: Cart Items */}
      <div className="lg:col-span-3 space-y-6">
        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-10 text-center">
            <h3 className="text-xl font-semibold text-gray-700">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mt-2">
              Start adding products to your cart.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item._id.toString()}
              className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4"
            >
              <CartItem
                item={{ ...item, _id: item._id.toString() }}
                removeItem={removeItem}
                updateQuantity={updateQuantity}
              />
            </div>
          ))
        )}
      </div>

      {/* RIGHT SIDE: Order Summary Table */}
      <div className="lg:col-span-1 bg-white border rounded-xl shadow-sm p-6 sticky top-24 h-[600px]">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Order Summary
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">Product</th>
                <th className="p-3 border">Qty</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Total</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item._id.toString()} className="hover:bg-gray-50">
                  <td className="p-3 border font-medium">{item.title}</td>
                  <td className="p-3 border">{item.quantity}</td>
                  <td className="p-3 border">${item.price}</td>
                  <td className="p-3 border font-semibold text-primary">
                    ${item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-6 text-lg font-semibold">
          <span>Total Items</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between mt-2 text-lg font-semibold">
          <span>Total Price</span>
          <span className="text-primary">${totalPrice}</span>
        </div>

        {/* Confirm Order Button */}
      <button
  onClick={() => router.push("/checkOut")}
  className="block w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
>
  Confirm Order
</button>

        {/* Payment Modal
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Choose Payment Method
              </h2>

              <div className="flex flex-col gap-3">
                {["Bkash", "Nagad", "Stripe", "Cash"].map((method) => (
                  <button
                    key={method}
                    onClick={() => handlePaymentClick(method)}
                    className={`w-full py-2 rounded-lg font-medium text-white transition ${
                      method === "Stripe"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : method === "Bkash"
                        ? "bg-red-500 hover:bg-red-600"
                        : method === "Nagad"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    {method === "Cash" ? "Cash on Delivery" : method}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 text-gray-500 hover:text-gray-700 w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}