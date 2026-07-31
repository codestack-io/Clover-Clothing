"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FolderTree,
  Search,
  Plus,
  Package,
  MoreHorizontal,
  X,
  Pencil,
  Trash2,
} from "lucide-react";

export default function CategoriesPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // --------------------------------
  // FETCH PRODUCTS
  // --------------------------------

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
    } catch (err) {
      console.error("Categories fetch error:", err);
      setError("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // --------------------------------
  // CREATE CATEGORY DATA
  // --------------------------------

  const categories = useMemo(() => {
    const categoryMap = {};

    products.forEach((product) => {
      const category = product.cottonType?.trim() || "Product";

      if (!categoryMap[category]) {
        categoryMap[category] = {
          id: category.toLowerCase().replace(/\s+/g, "-"),
          name: category,
          products: 0,
          sold: 0,
          revenue: 0,
        };
      }

      categoryMap[category].products += 1;

      categoryMap[category].sold += Number(product.sold) || 0;

      categoryMap[category].revenue +=
        (Number(product.price) || 0) *
        (Number(product.sold) || 0);
    });

    return Object.values(categoryMap);
  }, [products]);

  // --------------------------------
  // SEARCH
  // --------------------------------

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  // --------------------------------
  // SUMMARY
  // --------------------------------

  const totalCategories = categories.length;

  const totalProducts = categories.reduce(
    (sum, category) => sum + category.products,
    0
  );

  const totalSold = categories.reduce(
    (sum, category) => sum + category.sold,
    0
  );

  // --------------------------------
  // ADD CATEGORY
  // --------------------------------

  async function handleAddCategory(e) {
    e.preventDefault();

    const name = categoryName.trim();

    if (!name) {
      setFormError("Category name is required.");
      return;
    }

    /*
     * IMPORTANT:
     *
     * Your current database structure does not have a separate
     * categories collection.
     *
     * So this UI does not create a MongoDB category document.
     *
     * A category becomes available when a product is created
     * with that cottonType.
     */

    setSaving(true);
    setFormError("");

    try {
      // For now we only close the modal.
      // Later we can connect this to a real categories API.

      await new Promise((resolve) => setTimeout(resolve, 400));

      setCategoryName("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setFormError("Failed to create category.");
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl bg-white"
            />
          ))}
        </div>

        <div className="h-16 animate-pulse rounded-xl bg-white" />

        <div className="h-96 animate-pulse rounded-xl bg-white" />
      </div>
    );
  }

  // --------------------------------
  // ERROR
  // --------------------------------

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-xl border border-red-100 bg-white px-8 py-7 text-center shadow-sm">
          <FolderTree className="mx-auto h-8 w-8 text-red-400" />

          <p className="mt-3 text-sm font-medium text-red-600">
            {error}
          </p>

          <button
            onClick={fetchProducts}
            className="mt-4 text-sm font-medium text-emerald-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* -------------------------------- */}
        {/* HEADER */}
        {/* -------------------------------- */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Categories
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Organize and manage your Clover Clothing product categories.
            </p>
          </div>

          <button
            onClick={() => {
              setCategoryName("");
              setFormError("");
              setShowModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>

        {/* -------------------------------- */}
        {/* SUMMARY */}
        {/* -------------------------------- */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total Categories */}

          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <FolderTree className="h-5 w-5 text-emerald-600" />
              </div>

              <span className="text-xs font-medium text-emerald-600">
                Categories
              </span>
            </div>

            <p className="mt-4 text-2xl font-semibold text-slate-900">
              {totalCategories}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Active product categories
            </p>
          </div>

          {/* Products */}

          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Package className="h-5 w-5 text-blue-600" />
              </div>

              <span className="text-xs font-medium text-blue-600">
                Products
              </span>
            </div>

            <p className="mt-4 text-2xl font-semibold text-slate-900">
              {totalProducts.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Products across categories
            </p>
          </div>

          {/* Sold */}

          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <Package className="h-5 w-5 text-amber-600" />
              </div>

              <span className="text-xs font-medium text-amber-600">
                Sold
              </span>
            </div>

            <p className="mt-4 text-2xl font-semibold text-slate-900">
              {totalSold.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Total products sold
            </p>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* SEARCH */}
        {/* -------------------------------- */}

        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* -------------------------------- */}
        {/* CATEGORY TABLE */}
        {/* -------------------------------- */}

        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Category
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Products
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Sold
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Revenue
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-slate-50 transition hover:bg-slate-50/50"
                  >
                    {/* Category */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                          <FolderTree className="h-5 w-5 text-emerald-600" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {category.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            Product category
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Products */}

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-700">
                        {category.products.toLocaleString()}
                      </span>
                    </td>

                    {/* Sold */}

                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">
                        {category.sold.toLocaleString()}
                      </span>
                    </td>

                    {/* Revenue */}

                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-slate-800">
                        ৳{category.revenue.toLocaleString()}
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4 text-right">
                      <button
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        title="More options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty */}

          {filteredCategories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FolderTree className="h-10 w-10 text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-600">
                {search
                  ? "No categories found"
                  : "No categories yet"}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {search
                  ? "Try a different search."
                  : "Categories will appear when products are added."}
              </p>
            </div>
          )}
        </div>

        {/* Result */}

        {filteredCategories.length > 0 && (
          <p className="text-xs text-slate-400">
            Showing{" "}
            <span className="font-medium text-slate-600">
              {filteredCategories.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-600">
              {categories.length}
            </span>{" "}
            categories
          </p>
        )}
      </div>

      {/* ================================= */}
      {/* ADD CATEGORY MODAL */}
      {/* ================================= */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Add Category
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Create a new product category.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}

            <form onSubmit={handleAddCategory} className="p-6">
              <label className="text-sm font-medium text-slate-700">
                Category Name
              </label>

              <input
                type="text"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  setFormError("");
                }}
                placeholder="e.g. Premium Cotton"
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />

              {formError && (
                <p className="mt-2 text-xs text-red-500">
                  {formError}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}