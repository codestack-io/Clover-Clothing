"use client";

import React, { useState, useMemo } from "react";
import CartItem from "../Card/CartItem";
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

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">

      {/* LEFT: CART ITEMS */}
      <div className="lg:col-span-3 space-y-4 sm:space-y-6">
        {items.length === 0 ? (
          <div className="bg-white border rounded-xl p-6 sm:p-10 text-center">
            <h3 className="text-lg sm:text-xl font-semibold">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Start adding products to continue shopping.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-xl shadow-sm p-3 sm:p-4"
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
      <div className="lg:col-span-1 bg-white border rounded-xl shadow-sm p-4 sm:p-6 lg:sticky lg:top-24 h-fit">

        <h3 className="text-lg sm:text-xl font-semibold mb-4">
          Order Summary
        </h3>

        {/* TABLE WRAPPER (IMPORTANT FOR MOBILE SCROLL) */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm border min-w-[500px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border whitespace-nowrap">Product</th>
                <th className="p-2 border whitespace-nowrap">Qty</th>
                <th className="p-2 border whitespace-nowrap">Price</th>
                <th className="p-2 border whitespace-nowrap">Total</th>
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
        </div>

        {/* TOTALS */}
        <div className="mt-6 space-y-2 text-sm sm:text-base">
          <div className="flex justify-between">
            <span>Total Items</span>
            <span>{totalItems}</span>
          </div>

          <div className="flex justify-between font-bold">
            <span>Total Price</span>
            <span className="text-green-600">৳{totalPrice}</span>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => router.push("/checkout")}
          className="w-full mt-6 bg-green-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-green-700 text-sm sm:text-base"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}