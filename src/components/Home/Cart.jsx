"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import CartItem from "../Card/CartItem";
import useCartStore from "../../store/cartStore";

export default function Cart() {
  const router = useRouter();

  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity
  );
  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity
  );

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

      {/* LEFT — CART ITEMS */}
      <div className="space-y-4 lg:col-span-3">

        {cart.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center">
            <h3 className="text-xl font-semibold">
              Your cart is empty
            </h3>

            <p className="mt-2 text-gray-500">
              Start adding products to continue shopping.
            </p>

            <button
              onClick={() => router.push("/products")}
              className="mt-6 rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-neutral-800"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="rounded-2xl border bg-white p-4 shadow-sm"
            >
              <CartItem
                item={item}
                removeItem={removeFromCart}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
              />
            </div>
          ))
        )}

      </div>

      {/* RIGHT — ORDER SUMMARY */}
      <div className="h-fit rounded-2xl border bg-white p-5 shadow-sm lg:sticky lg:top-24">

        <h3 className="text-xl font-semibold">
          Order Summary
        </h3>

        <div className="mt-6 space-y-4">

          <div className="space-y-3">
  <h4 className="text-sm font-semibold text-gray-900">
    Items
  </h4>

  {cart.map((item) => (
    <div
      key={`${item.productId}-${item.size}`}
      className="flex items-start justify-between gap-4 text-sm"
    >
      <div className="min-w-0">
        <p className="font-medium text-gray-900 truncate">
          {item.name}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          Size: {item.size} × {item.quantity}
        </p>
      </div>

      <span className="shrink-0 font-medium text-gray-900">
        ৳{item.price * item.quantity}
      </span>
    </div>
  ))}
</div>

          <div className="border-t" />

          <div className="flex justify-between">
            <span className="font-medium">
              Total Price
            </span>

            <span className="text-xl font-bold">
              ৳{totalPrice}
            </span>
          </div>

        </div>

        <button
          disabled={cart.length === 0}
          onClick={() => router.push("/checkout")}
          className="mt-6 w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Proceed to Checkout
        </button>

      </div>

    </div>
  );
}