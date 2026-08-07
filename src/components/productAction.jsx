"use client";

import React, { useState } from "react";
import { Heart, Minus, Plus, ShieldCheck } from "lucide-react";
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
    <div className="space-y-8">
      {/* Size */}
      <div>
      
      <SizeSelector onSelect={setSelectedSize} />
      </div>

      {/* Quantity */}

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-700">
          Quantity
        </h3>

        <div className="inline-flex items-center rounded-xl border border-neutral-300 overflow-hidden">

          <button
            onClick={decrease}
            className="flex h-12 w-12 items-center justify-center hover:bg-neutral-100 transition"
          >
            <Minus size={18} />
          </button>

          <span className="flex h-12 w-14 items-center justify-center border-x border-neutral-300 font-semibold">
            {quantity}
          </span>

          <button
            onClick={increase}
            className="flex h-12 w-12 items-center justify-center hover:bg-neutral-100 transition"
          >
            <Plus size={18} />
          </button>

        </div>
      </div>

      {/* Purchase Buttons */}

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
        onClick={() => setWishlist(!wishlist)}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border py-4 font-medium transition ${
          wishlist
            ? "border-red-500 bg-red-50 text-red-600"
            : "border-neutral-300 hover:bg-neutral-100"
        }`}
      >
        <Heart
          size={20}
          fill={wishlist ? "currentColor" : "none"}
        />

        {wishlist ? "Added to Wishlist" : "Add to Wishlist"}
      </button>

   

     

    </div>
  );
};

export default ProductActions;