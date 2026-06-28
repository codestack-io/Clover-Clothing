"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { handleCart } from "../../action/server/cart";
import Swal from "sweetalert2";
import Image from "next/image";
import Link from "next/link";

const CartButton = ({ product }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [compareProducts, setCompareProducts] = useState([]);

  const { data: session } = useSession();
  const user = session?.user;

  const handleAddToCart = async () => {
    try {
      if (!product || !product._id) {
        Swal.fire("Error", "Product not found", "error");
        return;
      }

      // Check login
      if (!user) {
        router.push(`/auth/login?callbackUrl=${pathname}`);
        return;
      }

      // Check size
      if (!product.size) {
        Swal.fire("Please select a size first!");
        return;
      }

      setLoading(true);

      const result = await handleCart({
        productId: product._id.toString(),
        size: product.size,
      });

      if (result?.success) {
        Swal.fire(
          "Added to cart successfully",
          product.name,
          "success"
        );

        // Fetch similar products
        const res = await fetch(
          `/api/compare?cottonType=${encodeURIComponent(
            product.cottonType
          )}&id=${product._id}`
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setCompareProducts(data);
        }
      } else {
        Swal.fire(
          "Oops!",
          result?.message || "Something went wrong",
          "error"
        );
      }
    } catch (error) {
      console.error(error);

      Swal.fire(
        "Server Error",
        error.message || "Failed to add item",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Add To Cart Button */}

      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="mt-6 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition duration-300 shadow-md"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>

      {/* Similar Products */}

    {compareProducts.length > 0 && (
  <div className="mt-10">
    <h2 className="text-2xl font-bold mb-6 text-center">
      Similar Fabric Products
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

      {compareProducts.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
        >

          {/* Product Image */}
          <Link href={`/products/${item._id}`}>
            <div className="relative h-72 cursor-pointer">

              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover hover:scale-105 transition duration-300"
              />

            </div>
          </Link>

          {/* Product Details */}
          <div className="p-5">

            <h3 className="text-xl font-bold">
              {item.name}
            </h3>

            <p className="text-gray-500 mt-2">
              {item.brand}
            </p>

            <p className="text-red-600 font-bold text-xl mt-2">
              ৳ {item.price}
            </p>

            <p className="text-gray-500 mt-2">
              {item.cottonType}
            </p>

            <Link href={`/products/${item._id}`}>
              <button className="w-full mt-5 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
                View Details
              </button>
            </Link>

          </div>

        </div>
      ))}

    </div>
  </div>
)}
    </div>
  );
};

export default CartButton;