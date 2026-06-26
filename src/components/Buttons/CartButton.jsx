"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { handleCart } from "../../action/server/cart";
import Swal from "sweetalert2";

const CartButton = ({ product }) => {

  const router = useRouter();
  const pathname = usePathname();
  const [loading,setLoading] = useState(false);
  const [compareProducts,setCompareProducts] = useState([]);

  
const { data: session, status } = useSession();
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

    console.log("Cart Result:", result);

    if (result?.success) {
      Swal.fire(
        "Added to cart successfully",
        product?.name,
        "success"
      );

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
    console.error("Cart Error:", error);

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

      <button
        onClick={handleAddToCart}
        className="mt-6 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition duration-300 shadow-md"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>

      {/* Show similar products */}
      {compareProducts.length > 0 && (
        <div className="mt-10">

          <h2 className="text-xl font-bold mb-4">
            Similar Fabric Products
          </h2>

          <div className="grid grid-cols-3 gap-4">

            {compareProducts.map((item) => (
              <div key={item._id} className="border p-4 rounded">

                <h3 className="font-semibold">{item.name}</h3>
                <p>Brand: {item.brand}</p>
                <p>Price: ৳{item.price}</p>
                <p>Cotton: {item.cottonType}</p>

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
};

export default CartButton;