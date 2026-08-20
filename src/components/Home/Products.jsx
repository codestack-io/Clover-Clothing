"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../Card/ProductCard";
import ProductSkeleton from "../Skeleton/ProductSkeleton";
import LayoutSwitcher from "../LayoutSwicher/LayoutSwitcher";
import { FaSeedling } from "react-icons/fa";
import { RiSeedlingFill } from "react-icons/ri";
import { Search, PackageX, SearchX } from "lucide-react";

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
  const [wishlist, setWishlist] = useState([]);

  // Fetch products — unchanged from the original implementation.
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

  useEffect(() => {
  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist");

      if (!res.ok) {
        return;
      }

      const data = await res.json();

      if (data.success) {
        setWishlist(data.wishlist || []);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };

  fetchWishlist();
}, []);

  // Filter by search, category, price — unchanged from the original implementation.
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

  // Limit products if needed — unchanged from the original implementation.
  let displayedProducts = filteredProducts;
  if (limit && !showAll) {
    displayedProducts = filteredProducts.slice(0, limit);
  }

  // Grid columns based on layout — unchanged from the original implementation.
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

  // True "nothing exists" vs. "your filters excluded everything" are
  // different situations and get different messaging/CTAs.
  const noProductsAtAll = !isLoading && products.length === 0;
  const noFilteredResults =
    !isLoading && products.length > 0 && filteredProducts.length === 0;

    const handleWishlist = async (product) => {
  const productId = product._id?.toString();

  if (!productId) return;

  const isWishlisted = wishlist.some(
    (item) => item.productId === productId
  );

  try {
    if (isWishlisted) {
      // ==========================
      // REMOVE FROM WISHLIST
      // ==========================

      const res = await fetch(
        `/api/wishlist?productId=${productId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data.error);
        return;
      }

      setWishlist((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } else {
      // ==========================
      // ADD TO WISHLIST
      // ==========================

      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.error);
        return;
      }

      setWishlist((prev) => [
        ...prev,
        data.wishlistItem,
      ]);
    }
  } catch (error) {
    console.error("Wishlist error:", error);
  }
};

  return (
    <div>
      {/* Section header ---------------------------------------------- */}
      <div className="mx-auto max-w-2xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700"
        >
          Featured Collection
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl"
        >
          Best Sellers
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-neutral-500"
        >
          High-quality essentials curated for everyday comfort and timeless
          style.
        </motion.p>
        <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
      </div>

      {/* Layout Switcher — unchanged component */}
      <div className="mt-10">
        <LayoutSwitcher layout={layout} setLayout={setLayout} />
      </div>

      {/* FILTER BAR ---------------------------------------------------- */}
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-900 transition-colors focus:border-green-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-600/10"
          />
        </div>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 transition-colors focus:border-green-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-600/10 md:w-52"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All Categories" : cat}
            </option>
          ))}
        </select>

        {/* Price Slider */}
        <div className="w-full md:w-72">
          <div className="mb-1.5 flex justify-between text-xs font-medium text-neutral-500">
            <span>Price</span>
            <span className="text-neutral-800">
              ৳{priceRange[0]} – ৳{priceRange[1]}
            </span>
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
            aria-label="Maximum price"
            className="w-full cursor-pointer accent-green-700"
          />
        </div>

        {/* Product Count */}
        <p className="whitespace-nowrap text-sm font-medium text-neutral-500">
          {filteredProducts.length} Products
        </p>
      </div>

      {/* PRODUCTS GRID / EMPTY STATES ----------------------------------- */}
      {noProductsAtAll ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <PackageX className="h-7 w-7 text-neutral-400" aria-hidden="true" />
          </div>
          <p className="mt-4 text-base font-semibold text-neutral-800">
            No products available right now.
          </p>
          <a
            href="#top-categories-heading"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
          >
            Browse Categories
          </a>
        </div>
      ) : noFilteredResults ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <SearchX className="h-7 w-7 text-neutral-400" aria-hidden="true" />
          </div>
          <p className="mt-4 text-base font-semibold text-neutral-800">
            No products found
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className={`grid gap-6 ${getGridCols()}`}>
          {isLoading
            ? Array(limit || 9)
                .fill(0)
                .map((_, index) => <ProductSkeleton key={index} />)
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
  onToggleWishlist={handleWishlist}
  isWishlisted={wishlist.some(
    (item) => item.productId === product._id.toString()
  )}
/>
              ))}
        </div>
      )}

      {/* SEE MORE BUTTON ------------------------------------------------- */}
      {!isLoading && limit && filteredProducts.length > limit && (
        <div className="mt-10 flex justify-center">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={showAll ? "less" : "more"}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                {showAll ? (
                  <>
                    <FaSeedling /> Show Less
                  </>
                ) : (
                  <>
                    <RiSeedlingFill /> Show More
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Products;