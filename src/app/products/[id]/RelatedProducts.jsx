"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ArrowRight } from "lucide-react";

const RelatedProducts = ({ products = [] }) => {
  if (!products.length) return null;

  return (
    <section className="mt-20">
      {/* Heading */}

      <div className="mb-10 flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-bold text-neutral-900">
            You May Also Like
          </h2>

          <p className="mt-2 text-neutral-500">
            Similar premium products chosen for you.
          </p>

        </div>

        <Link
          href="/products"
          className="hidden items-center gap-2 text-sm font-semibold text-neutral-700 transition hover:text-black md:flex"
        >
          View All
          <ArrowRight size={16} />
        </Link>

      </div>

      {/* Products */}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

        {products.map((item) => {
          const finalPrice =
            item.discount > 0
              ? item.price - (item.price * item.discount) / 100
              : item.price;

          return (
            <div
              key={item._id}
              className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Image */}

              <div className="relative overflow-hidden">

                <Link href={`/products/${item._id}`}>

                  <div className="relative aspect-[4/5]">

                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />

                  </div>

                </Link>

                {/* Discount */}

                {item.discount > 0 && (
                  <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                    {item.discount}% OFF
                  </span>
                )}

                {/* Wishlist */}

                <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:scale-110">
                  <Heart size={18} />
                </button>

                {/* Quick View */}

                <Link href={`/products/${item._id}`}>

                  <button className="absolute bottom-5 left-1/2 flex -translate-x-1/2 translate-y-10 items-center gap-2 rounded-full bg-black px-5 py-2 text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">

                    <Eye size={16} />

                    Quick View

                  </button>

                </Link>

              </div>

              {/* Content */}

              <div className="space-y-4 p-5">

                <span className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                  {item.cottonType}
                </span>

                <h3 className="line-clamp-2 text-lg font-semibold text-neutral-900">
                  {item.name}
                </h3>

                <p className="text-sm text-neutral-500">
                  {item.brand}
                </p>

                <div className="flex items-center gap-3">

                  <span className="text-2xl font-bold">
                    ৳{finalPrice}
                  </span>

                  {item.discount > 0 && (
                    <span className="text-sm text-neutral-400 line-through">
                      ৳{item.price}
                    </span>
                  )}

                </div>

                <Link href={`/products/${item._id}`}>

                  <button className="w-full rounded-xl border border-black py-3 font-semibold transition hover:bg-black hover:text-white">

                    View Details

                  </button>

                </Link>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedProducts;