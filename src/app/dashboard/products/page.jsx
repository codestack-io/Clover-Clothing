"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Package,
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/dashboard/products", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load products");
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.color.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Products
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your Clover Clothing products.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-slate-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
          <p className="mt-3 text-sm text-slate-500">
            Loading products...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-100 bg-white p-8 text-center">
          <p className="text-sm font-medium text-red-600">{error}</p>

          <button
            onClick={fetchProducts}
            className="mt-3 text-sm font-medium text-emerald-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Products */}
      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">

          {/* Desktop table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">

              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Product
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Brand
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Type
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Price
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Sold
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-50 transition hover:bg-slate-50/50"
                  >

                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">

                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-slate-400" />
                          )}

                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {product.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {product.color || "No color"}
                            {product.size ? ` • ${product.size}` : ""}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* Brand */}
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {product.brand || "—"}
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                        {product.cottonType || "Product"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                      ৳{product.price.toLocaleString()}
                    </td>

                    {/* Sold */}
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {product.sold.toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* Empty */}
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-10 w-10 text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-600">
                No products found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try a different search.
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}