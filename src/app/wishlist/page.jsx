"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useCartStore from "../../store/cartStore";
import CartButton from "../../components/Buttons/CartButton";
import ViewDetails from "../../components/Buttons/ViewDetails";

export default function WishlistPage() {
  const [isMounted, setIsMounted] = useState(false);
  const wishlist = useCartStore((state) => state.wishlist) || [];
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);

  // Ensure initial client render matches server HTML to fix hydration error
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-neutral-50/50 px-4 py-8 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 h-10 w-48 animate-pulse rounded-lg bg-neutral-200" />
          <div className="grid grid-cols-2 gap-3.5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-64 animate-pulse rounded-2xl bg-neutral-200"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">
            My Wishlist ({wishlist.length})
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="my-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mb-4 h-16 w-16 text-neutral-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <h2 className="text-xl font-bold text-neutral-800">
              Your wishlist is empty
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Explore our collection and add your favorite products here!
            </p>
            <Link
              href="/products"
              className="mt-6 rounded-xl bg-emerald-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((p) => (
              <div
                key={p._id || p.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
              >
                {/* Product Image & Remove Button */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(p)}
                    aria-label="Remove from Wishlist"
                    className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-sm backdrop-blur-sm transition hover:scale-110 active:scale-95 sm:right-3 sm:top-3 sm:h-9 sm:w-9"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Card Content */}
                <div className="z-10 flex flex-grow flex-col justify-between p-3 sm:p-4">
                  <div>
                    <h2 className="line-clamp-1 text-xs font-bold text-neutral-900 sm:text-base">
                      {p.name}
                    </h2>
                    <span className="mt-1 block text-sm font-extrabold text-neutral-900 sm:text-lg">
                      ৳{p.price}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 flex flex-col gap-2">
                    <div className="w-full text-center [&>button]:w-full [&>button]:py-2 [&>button]:text-xs [&>button]:font-semibold [&>button]:whitespace-nowrap">
                      <CartButton product={p} />
                    </div>
                    <div className="w-full [&>a]:block [&>button]:w-full [&>button]:py-2 [&>button]:text-xs [&>button]:font-semibold [&>button]:whitespace-nowrap">
                      <ViewDetails product={p} type="cottonType" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}