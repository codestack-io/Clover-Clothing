"use client";

import { useEffect, useState } from "react";
import useCartStore from "@/store/cartStore";
import ViewDetails from "@/components/Buttons/ViewDetails";

export default function ProductCard({ product }) {
  const [isMounted, setIsMounted] = useState(false);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const isInWishlist = useCartStore(
    (state) => state.isInWishlist?.(product?._id) || false
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fabricText = product?.cottonType || product?.fabric || "Premium Cotton";
  const soldCount = product?.sold ?? 0;

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
        <img
          src={product?.image}
          alt={product?.name}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />

        {/* Wishlist Button: Visible on mobile, hover-only on desktop */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur-sm transition-all duration-300 opacity-100 pointer-events-auto sm:opacity-0 sm:pointer-events-none sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto hover:scale-110 active:scale-95"
          aria-label="Toggle Wishlist"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isMounted && isInWishlist ? "red" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className={`h-5 w-5 ${
              isMounted && isInWishlist ? "text-red-500 stroke-red-500" : "text-white"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* View Details Button: Visible on mobile, hover-only on desktop */}
        <div className="absolute bottom-3 left-1/2 z-10 w-[90%] -translate-x-1/2 transition-all duration-300 opacity-100 pointer-events-auto sm:bottom-4 sm:w-auto sm:opacity-0 sm:pointer-events-none sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto">
          <ViewDetails product={product} type="cottonType" />
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-bold text-gray-900">
          {product?.name}
        </h3>
        <p className="mt-1 text-xs text-gray-500">{fabricText}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-bold text-gray-900">
            ৳ {product?.price}
          </span>
          <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">
            {soldCount} sold
          </span>
        </div>
      </div>
    </div>
  );
}