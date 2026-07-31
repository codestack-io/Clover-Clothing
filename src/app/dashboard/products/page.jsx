"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Search,
  Plus,
  MoreHorizontal,
  X,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Product Modal
  const [showAddModal, setShowAddModal] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    cottonType: "",
    brand: "",
    size: "",
    color: "",
    price: "",
    sold: "0",
  });

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
    } catch (error) {
      console.error("Fetch products error:", error);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // --------------------------------
  // SEARCH
  // --------------------------------

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();

    return (
      (product.name || "").toLowerCase().includes(query) ||
      (product.brand || "").toLowerCase().includes(query) ||
      (product.color || "").toLowerCase().includes(query) ||
      (product.cottonType || "").toLowerCase().includes(query)
    );
  });

  // --------------------------------
  // FORM INPUT
  // --------------------------------

  function handleInputChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // --------------------------------
  // ADD PRODUCT
  // --------------------------------

  async function handleAddProduct(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setFormError("");

      const response = await fetch("/api/dashboard/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to add product");
      }

      // Close modal
      setShowAddModal(false);

      // Reset form
      setFormData({
        name: "",
        image: "",
        cottonType: "",
        brand: "",
        size: "",
        color: "",
        price: "",
        sold: "0",
      });

      // Refresh product list
      await fetchProducts();
    } catch (error) {
      console.error("Add product error:", error);

      setFormError(
        error.message || "Failed to add product"
      );
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------
  // CLOSE MODAL
  // --------------------------------

  function closeModal() {
    if (saving) return;

    setShowAddModal(false);
    setFormError("");

    setFormData({
      name: "",
      image: "",
      cottonType: "",
      brand: "",
      size: "",
      color: "",
      price: "",
      sold: "0",
    });
  }

  return (
    <>
      <div className="space-y-6">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Products
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your Clover Clothing products.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setFormError("");
              setShowAddModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>

        </div>

        {/* ========================================= */}
        {/* SEARCH */}
        {/* ========================================= */}

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

        {/* ========================================= */}
        {/* LOADING */}
        {/* ========================================= */}

        {loading && (
          <div className="rounded-xl border border-slate-100 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

            <p className="mt-3 text-sm text-slate-500">
              Loading products...
            </p>

          </div>
        )}

        {/* ========================================= */}
        {/* ERROR */}
        {/* ========================================= */}

        {!loading && error && (
          <div className="rounded-xl border border-red-100 bg-white p-8 text-center shadow-sm">

            <p className="text-sm font-medium text-red-600">
              {error}
            </p>

            <button
              onClick={fetchProducts}
              className="mt-3 text-sm font-medium text-emerald-600 hover:underline"
            >
              Try again
            </button>

          </div>
        )}

        {/* ========================================= */}
        {/* PRODUCTS TABLE */}
        {/* ========================================= */}

        {!loading && !error && (
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] text-left">

                {/* TABLE HEADER */}

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

                {/* TABLE BODY */}

                <tbody>

                  {filteredProducts.map((product) => (

                    <tr
                      key={product.id}
                      className="border-b border-slate-50 transition hover:bg-slate-50/50"
                    >

                      {/* PRODUCT */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">

                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name || "Product"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-slate-400" />
                            )}

                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-slate-800">
                              {product.name || "Unnamed Product"}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {product.color || "No color"}

                              {product.size
                                ? ` • ${product.size}`
                                : ""}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* BRAND */}

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {product.brand || "—"}
                      </td>

                      {/* TYPE */}

                      <td className="px-5 py-4">

                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                          {product.cottonType || "Product"}
                        </span>

                      </td>

                      {/* PRICE */}

                      <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                        ৳{Number(product.price || 0).toLocaleString()}
                      </td>

                      {/* SOLD */}

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {Number(product.sold || 0).toLocaleString()}
                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4 text-right">

                        <button
                          type="button"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* ========================================= */}
            {/* EMPTY */}
            {/* ========================================= */}

            {filteredProducts.length === 0 && (

              <div className="flex flex-col items-center justify-center py-16 text-center">

                <Package className="h-10 w-10 text-slate-300" />

                <p className="mt-3 text-sm font-medium text-slate-600">
                  No products found
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {search
                    ? "Try a different search."
                    : "Add your first product to get started."}
                </p>

              </div>

            )}

          </div>
        )}

      </div>

      {/* ================================================= */}
      {/* ADD PRODUCT MODAL */}
      {/* ================================================= */}

      {showAddModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Add New Product
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Add a new product to Clover Clothing.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleAddProduct}
              className="max-h-[75vh] overflow-y-auto p-6"
            >

              {/* FORM ERROR */}

              {formError && (
                <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* PRODUCT NAME */}

                <div className="sm:col-span-2">

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Product Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Black Embroidery Punjabi"
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />

                </div>

                {/* IMAGE */}

                <div className="sm:col-span-2">

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Image URL
                  </label>

                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/product.jpg"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Paste the product image URL.
                  </p>

                </div>

                {/* COTTON TYPE */}

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Cotton Type
                  </label>

                  <input
                    type="text"
                    name="cottonType"
                    value={formData.cottonType}
                    onChange={handleInputChange}
                    placeholder="Premium Cotton"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />

                </div>

                {/* BRAND */}

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Brand
                  </label>

                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Sailor"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />

                </div>

                {/* SIZE */}

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Size
                  </label>

                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >

                    <option value="">
                      Select size
                    </option>

                    <option value="S">
                      S
                    </option>

                    <option value="M">
                      M
                    </option>

                    <option value="L">
                      L
                    </option>

                    <option value="XL">
                      XL
                    </option>

                    <option value="XXL">
                      XXL
                    </option>

                  </select>

                </div>

                {/* COLOR */}

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Color
                  </label>

                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="Black"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />

                </div>

                {/* PRICE */}

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Price (৳) *
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="1890"
                    min="0"
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />

                </div>

                {/* SOLD */}

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Sold
                  </label>

                  <input
                    type="number"
                    name="sold"
                    value={formData.sold}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Usually starts at 0 for a new product.
                  </p>

                </div>

              </div>

              {/* MODAL BUTTONS */}

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add Product
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}
    </>
  );
}