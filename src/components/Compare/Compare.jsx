"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Compare = ({ selectedProduct }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedProduct) return;

    const fetchSimilarProducts = async () => {
      try {
        const res = await fetch(
          `/api/compare?cottonType=${selectedProduct.cottonType}&id=${selectedProduct._id}`
        );
        if (!res.ok) throw new Error("Failed to fetch comparison products");
        const data = await res.json();
        setSimilarProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [selectedProduct]);

  if (!selectedProduct) return <p>Loading product...</p>;

  const allProducts = [selectedProduct, ...similarProducts];

  const attributes = [
    { label: "Brand", key: "brand" },
    { label: "Price", key: "price", prefix: "৳" },
    { label: "Cotton Type", key: "cottonType" },
    { label: "Color", key: "color" },
    { label: "Size", key: "size" },
    { label: "Description", key: "description" },
  ];

  // Placeholder add-to-cart function
const handleAddToCart = (product) => {
  console.log("Added to cart:", product);

  Swal.fire({
    title: "Added to Cart!",
    text: `"${product.name}" has been added successfully.`,
    icon: "success",
    confirmButtonText: "OK",
  });
};

  return (
    <div className="mt-10 overflow-x-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-wide">
          Compare
        </h2>
        <a
  href="/"
  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
>
  Home
</a>
      </div>

      {/* Content */}
      {loading ? (
        <p>Loading similar products...</p>
      ) : allProducts.length === 0 ? (
        <p>No products to compare.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProducts.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg shadow p-4 bg-white flex flex-col items-center"
            >
              {/* Product Image + Name */}
              <img
                src={product.image}
                alt={product.name}
                className="w-40 h-40 object-cover mb-4 rounded"
              />
              <h3 className="font-bold text-lg text-center mb-2">{product.name}</h3>

              {/* Product Attributes */}
              <div className="w-full mt-2">
                {attributes.map((attr) => (
                  <div
                    key={`${product._id}-${attr.key}`}
                    className="flex justify-between border-t border-gray-200 py-1 px-2 text-sm"
                  >
                    <span className="font-medium">{attr.label}</span>
                    <span>
                      {attr.prefix ? `${attr.prefix}${product[attr.key]}` : product[attr.key]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-4 w-full bg-black hover:bg-blend-hue text-white font-semibold py-2 px-4 rounded shadow transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Compare;