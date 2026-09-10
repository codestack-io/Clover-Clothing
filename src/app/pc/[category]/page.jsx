"use client";

import CartButton from "../../../components/Buttons/CartButton";
import ViewDetails from "../../../components/Buttons/ViewDetails";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useCartStore from "../../../store/cartStore";

export default function CategoryPage({ params }) {
  const category = params?.category;
  const searchParams = useSearchParams();
  const cottonType = searchParams.get("cottonType");

  const [products, setProducts] = useState([]);

  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const wishlist = useCartStore((state) => state.wishlist) || [];

  const isWishlisted = (id) =>
    wishlist.some((item) => (item._id || item.id) === id);

  useEffect(() => {
    let url = "/api/products";
    if (cottonType) url += `?cottonType=${cottonType}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("API returned not an array:", data);
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setProducts([]);
      });
  }, [cottonType]);

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-6 sm:px-6 lg:px-12">
      {/* Category Heading */}
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
          {cottonType || category}
        </h1>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="my-20 text-center">
            <p className="text-base text-gray-500 sm:text-lg">
              No products found.
            </p>
          </div>
        )}

        {/* Responsive Product Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => {
            const activeWishlist = isWishlisted(p._id);

            return (
              <div
                key={p._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:shadow-md"
              >
                {/* Image Container with Wishlist Button & Fabric Badge */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Fabric Type Badge */}
                  {p.cottonType && (
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-emerald-700/95 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
                      {p.cottonType}
                    </span>
                  )}

                  {/* Wishlist Button Overlay */}
                  <button
                    onClick={() => toggleWishlist(p)}
                    aria-label="Add to Wishlist"
                    className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm backdrop-blur-sm transition hover:scale-110 active:scale-95 sm:right-3 sm:top-3 sm:h-9 sm:w-9"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={activeWishlist ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        activeWishlist ? "text-rose-500" : "text-gray-500"
                      }`}
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
                <div className="flex flex-grow flex-col p-3 sm:p-5">
                  <h2 className="line-clamp-1 text-xs font-bold text-gray-900 sm:text-base">
                    {p.name}
                  </h2>
                  
{/* Strictly Horizontal Single Line Action Row */}
<div className="mt-3  items-center justify-between gap-1">
  {/* Price Badge */}
  <span className="shrink-0 rounded-lg bg-emerald-800 px-1.5 py-1.5 text-[11px] font-extrabold text-white sm:px-2.5 sm:text-xs">
    ৳{p.price}
  </span>
<div className="flex flex-col gap-2 mt-3">
  {/* Cart Button Container */}
  <div className="w-full text-center [&>button]:w-full [&>button]:py-2 [&>button]:text-xs [&>button]:font-semibold [&>button]:whitespace-nowrap">
    <CartButton product={p} />
  </div>

  {/* View Details Container */}
  <div className="w-full [&>a]:block [&>button]:w-full [&>button]:py-2 [&>button]:text-xs [&>button]:font-semibold [&>button]:whitespace-nowrap">
    <ViewDetails product={p} type="cottonType" />
  </div>
</div>
  
</div>
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}