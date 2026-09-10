"use client";

import useCartStore from "@/store/cartStore"; // Adjust import path
import { useEffect, useState } from "react";

export default function WishlistButton({ product }) {
  const { wishlist, addToWishlist, removeFromWishlist } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const productId = product._id || product.id;
  const isWishlisted = wishlist.some(
    (item) => (item._id || item.id) === productId
  );

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  if (!mounted) {
    return (
      <button
        disabled
        className="flex items-center justify-center rounded-xl border border-neutral-200 bg-white p-3 text-neutral-400 opacity-50"
      >
        <HeartIcon filled={false} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleWishlist}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex items-center justify-center rounded-xl border p-3 transition active:scale-95 ${
        isWishlisted
          ? "border-rose-200 bg-rose-50 text-rose-600"
          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
      }`}
    >
      <HeartIcon filled={isWishlisted} />
    </button>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}