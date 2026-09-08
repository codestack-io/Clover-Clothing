// app/wishlist/page.jsx
"use client";

import { useEffect, useState } from "react";
import ProductCard from "../../components/Card/ProductCard"; // Adjust path as needed

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch("/api/wishlist");
        const data = await res.json();

        if (data.success && Array.isArray(data.wishlist)) {
          // Normalize wishlist items into standard product structure
          const formattedProducts = data.wishlist.map((item) => ({
            _id: item.productId, // Map productId to _id for ProductCard
            name: item.name,
            price: item.price,
            image: item.image,
            // Include optional fields if present
            shortDescription: item.shortDescription || "",
            cottonType: item.cottonType || "",
            sold: item.sold || null,
          }));

          setWishlist(formattedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-neutral-500">Loading wishlist...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Wishlist ({wishlist.length})</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-16 text-neutral-500">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}