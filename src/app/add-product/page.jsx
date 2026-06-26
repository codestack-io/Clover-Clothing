"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Link from "next/link";

const COTTON_TYPES = [
  "Soft Cotton",
  "Light Cotton",
  "Silk Cotton",
  "Handloom Cotton",
  "Organic Cotton",
  "100% Cotton",
];

export default function AddProductPage() {
  const { data: session, status } = useSession();

const user = session?.user;
const loading = status === "loading";
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    cottonType: "",
    color: "",
    image: "",
    discount: "",
  });

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?callbackUrl=/add-product");
    }
  }, [user, loading, router]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          discount: Number(form.discount) || 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to add product");

      await Swal.fire({
        title: "Product Added!",
        text: `"${form.name}" has been added to the store.`,
        icon: "success",
        confirmButtonColor: "#16a34a",
      });

      // Reset form
      setForm({
        name: "",
        shortDescription: "",
        description: "",
        price: "",
        cottonType: "",
        color: "",
        image: "",
        discount: "",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-gray-500 mt-1">Fill in the details to list a new item</p>
        </div>
        <Link
          href="/manage-products"
          className="text-sm text-gray-600 hover:text-black underline"
        >
          Manage Products →
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md p-8 space-y-5"
      >
        {/* Product Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Royal Blue Punjabi"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Short Description <span className="text-red-500">*</span>
          </label>
          <input
            name="shortDescription"
            type="text"
            required
            value={form.shortDescription}
            onChange={handleChange}
            placeholder="1–2 line summary shown on product cards"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Full Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Full Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="Detailed product description..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />
        </div>

        {/* Price + Discount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Price (৳) <span className="text-red-500">*</span>
            </label>
            <input
              name="price"
              type="number"
              required
              min="1"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 1750"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Discount (%)
            </label>
            <input
              name="discount"
              type="number"
              min="0"
              max="100"
              value={form.discount}
              onChange={handleChange}
              placeholder="e.g. 10"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Cotton Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Cotton Type <span className="text-red-500">*</span>
          </label>
          <select
            name="cottonType"
            required
            value={form.cottonType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select cotton type</option>
            {COTTON_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Color
          </label>
          <input
            name="color"
            type="text"
            value={form.color}
            onChange={handleChange}
            placeholder="e.g. Royal Blue"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Image URL
          </label>
          <input
            name="image"
            type="url"
            value={form.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {form.image && (
            <img
              src={form.image}
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover rounded-lg border"
              onError={(e) => (e.target.style.display = "none")}
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-60"
        >
          {submitting ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
