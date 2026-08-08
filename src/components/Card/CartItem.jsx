"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineDelete,
} from "react-icons/ai";
import Swal from "sweetalert2";

const CartItem = ({
  item,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
}) => {
  const { productId, name, image, quantity, price, size } = item;

  const [loading, setLoading] = useState(false);

  // =========================
  // INCREASE
  // =========================
  const onIncrease = () => {
    if (quantity >= 10) return;

    setLoading(true);

    increaseQuantity(productId, size);

    setLoading(false);
  };

  // =========================
  // DECREASE
  // =========================
  const onDecrease = () => {
    if (quantity <= 1) return;

    setLoading(true);

    decreaseQuantity(productId, size);

    setLoading(false);
  };

  // =========================
  // DELETE
  // =========================
  const handleDeleteCart = () => {
    Swal.fire({
      title: "Remove product?",
      text: "This product will be removed from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it",
    }).then((result) => {
      if (result.isConfirmed) {
        removeItem(productId, size);

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Removed from cart",
          showConfirmButton: false,
          timer: 1200,
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

      {/* =========================
          PRODUCT IMAGE
      ========================= */}
      <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>

      {/* =========================
          PRODUCT DETAILS
      ========================= */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">
          {name}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Size: {size}
        </p>

        <p className="mt-1 font-semibold">
          ৳{price}
        </p>
      </div>

      {/* =========================
          QUANTITY CONTROLS
      ========================= */}
      <div className="flex items-center gap-2">

        <button
          onClick={onDecrease}
          disabled={quantity <= 1 || loading}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <AiOutlineMinus size={16} />
        </button>

        <span className="min-w-[30px] text-center font-semibold">
          {quantity}
        </span>

        <button
          onClick={onIncrease}
          disabled={quantity >= 10 || loading}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <AiOutlinePlus size={16} />
        </button>

      </div>

      {/* =========================
          TOTAL
      ========================= */}
      <div className="min-w-[90px] text-right font-bold">
        ৳{price * quantity}
      </div>

      {/* =========================
          DELETE
      ========================= */}
      <button
        onClick={handleDeleteCart}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-700"
        title="Remove from cart"
      >
        <AiOutlineDelete size={20} />
      </button>

    </div>
  );
};

export default CartItem;