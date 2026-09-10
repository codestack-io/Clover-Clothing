// components/Card/ProductCard.jsx
"use client";

import useCartStore from "../../store/cartStore";

export default function ProductCard({ product }) {
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const isInWishlist = useCartStore((state) => state.isInWishlist(product._id));

  return (
    <div className="border rounded-xl p-4 relative bg-white shadow-sm">
      {/* Heart Toggle Button */}
      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:scale-105 transition-transform"
        aria-label="Toggle Wishlist"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isInWishlist ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-6 h-6 ${isInWishlist ? "text-red-500" : "text-gray-400"}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>

      {/* Product Image & Details */}
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-3" />
      <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
      <p className="text-gray-600 font-medium">${product.price}</p>
    </div>
  );
}