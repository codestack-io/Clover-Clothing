"use client";

import React, { useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import SizeSelector from "./SizeSelector/SizeSelector";
import CartButton from "./Buttons/CartButton";

const ProductActions = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);

  const increase = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Size */}
      <div>
        <SizeSelector onSelect={setSelectedSize} />
      </div>

      {/* Quantity */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-700 sm:text-sm">
          Quantity
        </h3>

        <div className="inline-flex overflow-hidden rounded-xl border border-neutral-300">

          <button
            type="button"
            onClick={decrease}
            aria-label="Decrease quantity"
            className="flex h-11 w-11 items-center justify-center transition hover:bg-neutral-100 sm:h-12 sm:w-12"
          >
            <Minus size={17} />
          </button>

          <span className="flex h-11 w-14 items-center justify-center border-x border-neutral-300 text-sm font-semibold sm:h-12 sm:w-14 sm:text-base">
            {quantity}
          </span>

          <button
            type="button"
            onClick={increase}
            aria-label="Increase quantity"
            className="flex h-11 w-11 items-center justify-center transition hover:bg-neutral-100 sm:h-12 sm:w-12"
          >
            <Plus size={17} />
          </button>

        </div>
      </div>

      {/* Purchase Button */}
      <div className="space-y-3">
        <CartButton
          product={{
            ...product,
            quantity,
            size: selectedSize,
          }}
        />
      </div>

      {/* Wishlist */}
      <button
        type="button"
        onClick={() => setWishlist(!wishlist)}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3.5 text-sm font-medium transition sm:py-4 sm:text-base ${
          wishlist
            ? "border-red-500 bg-red-50 text-red-600"
            : "border-neutral-300 hover:bg-neutral-100"
        }`}
      >
        <Heart
          size={19}
          fill={wishlist ? "currentColor" : "none"}
        />

        {wishlist
          ? "Added to Wishlist"
          : "Add to Wishlist"}
      </button>

    </div>
  );
};

export default ProductActions;