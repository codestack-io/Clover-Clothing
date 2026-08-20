
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  // ==========================
  // FETCH WISHLIST
  // ==========================

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch("/api/wishlist");

        const data = await res.json();

        if (res.ok && data.success) {
          setWishlist(data.wishlist || []);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // ==========================
  // REMOVE FROM WISHLIST
  // ==========================

  const removeFromWishlist = async (productId) => {
    try {
      setRemovingId(productId);

      const res = await fetch(
        `/api/wishlist?productId=${productId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data.error);
        return;
      }

      setWishlist((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error("Remove wishlist error:", error);
    } finally {
      setRemovingId(null);
    }
  };

  // ==========================
  // LOADING
  // ==========================

  if (isLoading) {
    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="mx-auto h-8 w-48 rounded bg-neutral-200" />

            <div className="mx-auto mt-3 h-4 w-64 rounded bg-neutral-200" />

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl bg-white"
                >
                  <div className="aspect-[4/5] bg-neutral-200" />

                  <div className="space-y-3 p-4">
                    <div className="h-4 w-3/4 rounded bg-neutral-200" />
                    <div className="h-4 w-1/3 rounded bg-neutral-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==========================
  // EMPTY WISHLIST
  // ==========================

  if (wishlist.length === 0) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-neutral-50 px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <Heart className="h-9 w-9 text-green-700" />
          </div>

          <h1 className="mt-6 text-2xl font-semibold text-neutral-900">
            Your Wishlist is Empty
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-neutral-500">
            Save your favorite products here and come back whenever you're
            ready to shop.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            <ShoppingBag className="h-4 w-4" />
            Browse Products
          </Link>
        </motion.div>
      </main>
    );
  }

  // ==========================
  // WISHLIST PAGE
  // ==========================

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
            Your Favorites
          </span>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            My Wishlist
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-neutral-500">
            Products you've saved for later.
          </p>

          <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
        </motion.div>

        {/* WISHLIST COUNT */}
        <div className="mt-10 flex items-center justify-between">
          <p className="text-sm font-medium text-neutral-500">
            {wishlist.length}{" "}
            {wishlist.length === 1 ? "Product" : "Products"}
          </p>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 transition-colors hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {/* PRODUCTS */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((item, index) => (
            <motion.article
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
              }}
              className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
            >
              {/* IMAGE */}
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                <Link
                  href={`/products/${item.productId}`}
                  className="absolute inset-0"
                >
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </Link>

                {/* REMOVE BUTTON */}
                <button
                  type="button"
                  onClick={() =>
                    removeFromWishlist(item.productId)
                  }
                  disabled={removingId === item.productId}
                  aria-label={`Remove ${item.name} from wishlist`}
                  className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-md backdrop-blur-sm transition-all hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* WISHLIST BADGE */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur-sm">
                  <Heart className="h-3.5 w-3.5 fill-current text-green-700" />
                  Wishlisted
                </div>
              </div>

              {/* PRODUCT INFO */}
              <div className="p-4">
                <Link href={`/products/${item.productId}`}>
                  <h2 className="line-clamp-2 text-[15px] font-medium text-neutral-900 transition-colors hover:text-green-700">
                    {item.name}
                  </h2>
                </Link>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-base font-semibold text-neutral-900">
                    ৳ {item.price}
                  </span>
                </div>

                {/* ADD TO CART */}
                <button
                  type="button"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
}
