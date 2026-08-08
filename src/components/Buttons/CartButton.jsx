"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { ShoppingBag } from "lucide-react";

import useCartStore from "../../store/cartStore";

const CartButton = ({ product }) => {
  const [loading, setLoading] = useState(false);

  const [compareProducts, setCompareProducts] = useState([]);

  // Zustand cart
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = async () => {
    try {
      // Product validation
      if (!product || !product._id) {
        Swal.fire({
          icon: "error",
          title: "Product not found",
        });

        return;
      }

      // Size validation
      if (!product.size) {
        Swal.fire({
          icon: "warning",
          title: "Select a size first",
          text: "Please select your preferred size before adding this product.",
          confirmButtonColor: "#000",
        });

        return;
      }

      setLoading(true);

      // ==========================================
      // ADD PRODUCT TO ZUSTAND CART
      // ==========================================

      addToCart({
        productId: product._id.toString(),
        name: product.name,
        image: product.image,
        price: Number(product.price || 0),
        size: product.size,
        quantity: product.quantity || 1,
      });

      // ==========================================
      // SUCCESS MESSAGE
      // ==========================================

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Added to cart",
        text: product.name,
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      });

      // ==========================================
      // FETCH SIMILAR PRODUCTS
      // ==========================================

      const res = await fetch(
        `/api/compare?cottonType=${encodeURIComponent(
          product.cottonType || ""
        )}&id=${product._id}`
      );

      if (res.ok) {
        const data = await res.json();

        if (Array.isArray(data)) {
          setCompareProducts(data);
        }
      }
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: error.message || "Failed to add product to cart.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ==========================================
          ADD TO CART BUTTON
      ========================================== */}

      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-black py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <ShoppingBag size={20} />

        {loading ? "Adding..." : "Add to Cart"}
      </button>

      {/* ==========================================
          YOU MAY ALSO LIKE
      ========================================== */}

      {compareProducts.length > 0 && (
        <section className="mt-14">
          {/* Heading */}

          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Curated for you
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                You May Also Like
              </h2>
            </div>

            <Link
              href="/products"
              className="text-sm font-medium text-neutral-500 transition hover:text-black"
            >
              View All →
            </Link>
          </div>

          {/* Products */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {compareProducts.map((item) => (
              <article
                key={item._id}
                className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}

                <Link href={`/products/${item._id}`}>
                  <div className="relative h-64 overflow-hidden bg-neutral-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                </Link>

                {/* Content */}

                <div className="p-5">
                  <h3 className="line-clamp-1 text-base font-semibold text-neutral-900">
                    {item.name}
                  </h3>

                  {item.brand && (
                    <p className="mt-1 text-sm text-neutral-500">
                      {item.brand}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-neutral-900">
                      ৳{item.price}
                    </span>

                    {item.cottonType && (
                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                        {item.cottonType}
                      </span>
                    )}
                  </div>

                  {/* View Product */}

                  <Link
                    href={`/products/${item._id}`}
                    className="mt-4 block w-full rounded-xl bg-neutral-900 py-3 text-center text-sm font-semibold text-white transition hover:bg-black"
                  >
                    View Product
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default CartButton;