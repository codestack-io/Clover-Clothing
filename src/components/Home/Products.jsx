"use client";

import { useEffect, useState, useMemo } from "react";
import ProductCard from "../Card/ProductCard";
import ProductSkeleton from "../Skeleton/ProductSkeleton";
import LayoutSwitcher from "../LayoutSwicher/LayoutSwitcher";
import { FaSeedling } from "react-icons/fa";
import { RiSeedlingFill } from "react-icons/ri";

const Products = ({ limit }) => {
  const [products, setProducts] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [layout, setLayout] = useState("3"); // Default layout: 3 products per row

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter by price
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.price >= priceRange[0] &&
        product.price <= priceRange[1]
    );
  }, [products, priceRange]);

  // Limit products if needed
  let displayedProducts = filteredProducts;
  if (limit && !showAll) {
    displayedProducts = filteredProducts.slice(0, limit);
  }

  // Determine grid classes based on layout
  const getGridCols = () => {
    switch (layout) {
      case "2":
        return "grid-cols-1 sm:grid-cols-2";
      case "3":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      case "4":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      case "list":
        return "grid-cols-1";
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
    }
  };

  return (
    <div>
      {/* Layout Switcher */}
      <LayoutSwitcher layout={layout} setLayout={setLayout} />

      {/* SORT BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 border-b pb-6">
        {/* Product Count */}
        <p className="text-gray-600 font-medium">
          {products.length} Products
        </p>

        {/* Price Slider */}
        <div className="flex flex-col w-full md:w-80">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Price</span>
            <span>৳{priceRange[0]} - ৳{priceRange[1]}</span>
          </div>

          <input
            type="range"
            min="0"
            max="10000"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-full accent-black cursor-pointer"
          />
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className={`grid gap-6 ${getGridCols()}`}>
        {isLoading
          ? Array(limit || 9)
              .fill(0)
              .map((_, index) => <ProductSkeleton key={index} />)
          : displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  id: product.id,
                  image: product.image || "/placeholder.png",
                  name: product.name || "Unnamed Product",
                  layout, // pass layout if your ProductCard needs to adjust styling
                }}
              />
            ))}
      </div>

      {/* SEE MORE BUTTON */}
      {!isLoading && limit && products.length > limit && (
        <div className="flex justify-center mt-7">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            {showAll ? <FaSeedling /> : <RiSeedlingFill />}
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;