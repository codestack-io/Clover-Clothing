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
    <div className="w-full">

      {cart.length === 0 ? (
        /* ================= EMPTY CART ================= */
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm sm:p-10">
          <h3 className="text-xl font-semibold text-neutral-900">
            Your cart is empty
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-neutral-500 sm:text-base">
            Start adding products to your cart to continue shopping.
          </p>

          <button
            type="button"
            onClick={() => router.push("/products")}
            className="mt-6 w-full rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 sm:w-auto sm:text-base"
          >
            Continue Shopping
          </button>
        </div>
      ) : (

        /* ================= CART ================= */
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4 lg:gap-6">

          {/* ================= LEFT — CART ITEMS ================= */}
          <div className="min-w-0 space-y-3 sm:space-y-4 lg:col-span-3">

            {/* Cart heading */}
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl">
                  Shopping Cart
                </h2>

                <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            {/* Cart Items */}
            {cart.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm sm:p-4"
              >
                <CartItem
                  item={item}
                  removeItem={removeFromCart}
                  increaseQuantity={increaseQuantity}
                  decreaseQuantity={decreaseQuantity}
                />
              </div>
            ))}
          </div>

          {/* ================= RIGHT — ORDER SUMMARY ================= */}
          <div className="min-w-0">

            <div className="h-fit rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5 lg:sticky lg:top-24">

              {/* Summary Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900 sm:text-xl">
                  Order Summary
                </h3>

                <span className="text-xs text-neutral-500 sm:text-sm">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="mt-5 space-y-4 sm:mt-6">

                {/* Items */}
                <div className="space-y-3">

                  <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Items
                  </h4>

                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={`${item.productId}-${item.size}`}
                        className="flex items-start justify-between gap-3"
                      >

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-neutral-900">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">
                            Size: {item.size} × {item.quantity}
                          </p>
                        </div>

                        <span className="shrink-0 text-sm font-medium text-neutral-900">
                          ৳{item.price * item.quantity}
                        </span>

                      </div>
                    ))}
                  </div>

                </div>

                {/* Divider */}
                <div className="border-t border-neutral-200" />

                {/* Total */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-neutral-600 sm:text-base">
                    Total Price
                  </span>

                  <span className="text-xl font-bold text-neutral-900 sm:text-2xl">
                    ৳{totalPrice}
                  </span>
                </div>

              </div>

              {/* Checkout */}
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => router.push("/checkout")}
                className="mt-5 w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-6 sm:py-4 sm:text-base"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="mt-3 w-full rounded-xl border border-neutral-300 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100"
              >
                Continue Shopping
              </button>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}