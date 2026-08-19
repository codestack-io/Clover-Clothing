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
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-24">
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
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
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
          MOBILE CONTROLS
          QUANTITY + DELETE
      ========================= */}
      <div className="flex items-center justify-between gap-4 sm:hidden">

        {/* Quantity */}
        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={onDecrease}
            disabled={quantity <= 1 || loading}
            aria-label="Decrease quantity"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <AiOutlineMinus size={16} />
          </button>

          <span className="flex min-w-[30px] items-center justify-center font-semibold">
            {quantity}
          </span>

          <button
            type="button"
            onClick={onIncrease}
            disabled={quantity >= 10 || loading}
            aria-label="Increase quantity"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <AiOutlinePlus size={16} />
          </button>

        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={handleDeleteCart}
          aria-label="Remove from cart"
          title="Remove from cart"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-700"
        >
          <AiOutlineDelete size={20} />
        </button>

      </div>

      {/* =========================
          DESKTOP CONTROLS
      ========================= */}
      <div className="hidden items-center gap-2 sm:flex">

        <button
          type="button"
          onClick={onDecrease}
          disabled={quantity <= 1 || loading}
          aria-label="Decrease quantity"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <AiOutlineMinus size={16} />
        </button>

        <span className="min-w-[30px] text-center font-semibold">
          {quantity}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          disabled={quantity >= 10 || loading}
          aria-label="Increase quantity"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <AiOutlinePlus size={16} />
        </button>

      </div>

      {/* =========================
          TOTAL
      ========================= */}
      <div className="flex items-center justify-between sm:block sm:min-w-[90px] sm:text-right">
        <span className="text-sm text-gray-500 sm:hidden">
          Total
        </span>

        <span className="font-bold">
          ৳{price * quantity}
        </span>
      </div>

      {/* =========================
          DESKTOP DELETE
      ========================= */}
      <button
        type="button"
        onClick={handleDeleteCart}
        aria-label="Remove from cart"
        title="Remove from cart"
        className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-700 sm:flex"
      >
        <AiOutlineDelete size={20} />
      </button>

    </div>
  );
};

export default CartItem;