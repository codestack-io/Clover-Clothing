import Products from "@/components/Home/Products";
import React from "react";

export const metadata = {
  title: "All Items | Clover Clothing",
  description:
    "Browse our full collection of premium clothing at Clover Clothing. Filter by category, price, and more.",
};

const ItemsPage = () => {
  return (
    <main className="px-6 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">All Items</h1>
          <p className="text-gray-500 mt-1">Discover our latest collection</p>
        </div>
      </div>

      <Products />
    </main>
  );
};

export default ItemsPage;
