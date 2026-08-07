"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { ShoppingBag, X } from "lucide-react";
import { handleCart } from "../../action/server/cart";


const CartButton = ({ product }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(false);

  

  const [compareProducts, setCompareProducts] = useState([]);

  const handleAddToCart = async () => {
    try {
      if (!product || !product._id) {
        Swal.fire({
          icon: "error",
          title: "Product not found",
        });
        return;
      }

      /* Login */

      if (!user) {
        router.push(`/auth/login?callbackUrl=${pathname}`);
        return;
      }

      /* Size */

      if (!product.size) {
        Swal.fire({
          icon: "warning",
          title: "Select a size first",
        });
        return;
      }

      setLoading(true);

      const result = await handleCart({
        productId: product._id.toString(),
        size: product.size,
        quantity: product.quantity,
      });

      if (!result?.success) {
        Swal.fire({
          icon: "error",
          title: result?.message || "Failed to add product",
        });
        return;
      }

        /* Similar Products */

      const res = await fetch(
        `/api/compare?cottonType=${encodeURIComponent(
          product.cottonType
        )}&id=${product._id}`
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setCompareProducts(data);
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

 return (
  <>
    {/* Add To Cart */}

    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-black py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <ShoppingBag size={20} />

      {loading ? "Adding..." : "Add to Cart"}
    </button>

    

 {/* Recommended Products */}
      {compareProducts.length > 0 && (
        <div className="mt-10">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-2xl font-bold">
              You May Also Like
            </h2>

            <Link
              href="/products"
              className="text-sm font-medium text-neutral-600 hover:text-black"
            >
              View All →
            </Link>

          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {compareProducts.map((item) => (

              <div
                key={item._id}
                className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* Image */}

                <Link href={`/products/${item._id}`}>

                  <div className="relative h-72 overflow-hidden">

                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />

                  </div>

                </Link>

                {/* Content */}

                <div className="space-y-3 p-5">

                  <h3 className="line-clamp-2 text-lg font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-sm text-neutral-500">
                    {item.brand}
                  </p>

                  <div className="flex items-center justify-between">

                    <span className="text-2xl font-bold text-black">
                      ৳{item.price}
                    </span>

                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                      {item.cottonType}
                    </span>

                  </div>

                  <Link href={`/products/${item._id}`}>

                    <button className="mt-2 w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-neutral-800">

                      View Details

                    </button>

                  </Link>

                </div>

              </div>

            ))}

          </div>

        </div>
      )}

    </>
  );
};

export default CartButton;
