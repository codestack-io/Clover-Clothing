"use client";

import { useEffect, useState, useMemo } from "react";
import ProductCard from "../Card/ProductCard";
import ProductSkeleton from "../Skeleton/ProductSkeleton";
import LayoutSwitcher from "../LayoutSwicher/LayoutSwitcher";
import { FaSeedling } from "react-icons/fa";
import { RiSeedlingFill } from "react-icons/ri";

const CATEGORIES = [
  "All",
  "Soft Cotton",
  "Light Cotton",
  "Silk Cotton",
  "Handloom Cotton",
  "Organic Cotton",
];

const Products = ({ limit }) => {
  const [products, setProducts] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [layout, setLayout] = useState("3");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) {
          const text = await res.text();
          console.error("API Error:", res.status, text);
          throw new Error("Failed to fetch products");
        }
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

  // Filter by search, category, price
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch =
        search === "" ||
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.cottonType?.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        category === "All" || product.cottonType === category;
      const matchPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchSearch && matchCategory && matchPrice;
    });
  }, [products, search, category, priceRange]);

  // Limit products if needed
  let displayedProducts = filteredProducts;
  if (limit && !showAll) {
    displayedProducts = filteredProducts.slice(0, limit);
  }

  // Grid columns based on layout
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

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 border-b pb-6">

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-52 focus:outline-none focus:ring-2 focus:ring-black bg-white"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All Categories" : cat}
            </option>
          ))}
        </select>

        {/* Price Slider */}
        <div className="w-full md:w-72">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Price</span>
            <span>৳{priceRange[0]} – ৳{priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-full accent-black cursor-pointer"
          />
        </div>

        {/* Product Count */}
        <p className="text-gray-600 font-medium whitespace-nowrap">
          {filteredProducts.length} Products
        </p>
      </div>

      {/* PRODUCTS GRID */}
      <div className={`grid gap-6 ${getGridCols()}`}>
        {isLoading
          ? Array(limit || 9)
              .fill(0)
              .map((_, index) => <ProductSkeleton key={index} />)
          : displayedProducts.length === 0
          ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
              <p className="text-xl font-semibold mb-2">No products found</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          )
          : displayedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={{
                  ...product,
                  id: product._id,
                  image: product.image || "/placeholder.png",
                  name: product.name || "Unnamed Product",
                  layout,
                }}
              />
            ))}
      </div>

      {/* SEE MORE BUTTON */}
      {!isLoading && limit && filteredProducts.length > limit && (
        <div className="flex justify-center mt-7">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
          >
            {showAll ? <><FaSeedling /> Show Less</> : <><RiSeedlingFill /> Show More</>}
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
