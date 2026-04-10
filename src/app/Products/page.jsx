import Products from "@/components/Home/Products";
import React from "react";

export const metadata = {
  title: "All Products",
  description:
    "Explore our wide range of clothing products at Clover Clothing. From trendy tops to stylish bottoms, find the perfect pieces to elevate your wardrobe.",
};

const ProductsPage = () => {
  return (
    <main className="px-6 py-12 max-w-7xl mx-auto">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <h1 className="text-3xl font-bold">All Products</h1>

        <p className="text-gray-500 mt-2 md:mt-0">
          Discover our latest collection
        </p>
      </div>

      <Products />

    </main>
  );
};

export default ProductsPage;