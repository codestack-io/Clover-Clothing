"use client";

import { useEffect, useState } from "react";
import {
  Star,
  Search,
  Check,
  X,
  Trash2,
  MessageSquare,
  User,
  Package,
} from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchReviews() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/dashboard/reviews", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load reviews");
      }

      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Reviews error:", error);
      setError("Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  async function updateStatus(id, status) {
    try {
      const response = await fetch("/api/dashboard/reviews", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message);
      }

      setReviews((current) =>
        current.map((review) =>
          review.id === id
            ? { ...review, status }
            : review
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update review.");
    }
  }

  async function deleteReview(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/dashboard/reviews?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message);
      }

      setReviews((current) =>
        current.filter((review) => review.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete review.");
    }
  }

  const filteredReviews = reviews.filter((review) => {
    const query = search.toLowerCase();

    const matchesSearch =
      review.customer?.toLowerCase().includes(query) ||
      review.email?.toLowerCase().includes(query) ||
      review.product?.toLowerCase().includes(query) ||
      review.comment?.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      review.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalReviews = reviews.length;

  const approvedReviews = reviews.filter(
    (review) => review.status === "approved"
  ).length;

  const pendingReviews = reviews.filter(
    (review) => review.status === "pending"
  ).length;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + Number(review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  function renderStars(rating) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-slate-200"
            }`}
          />
        ))}
      </div>
    );
  }

  function statusStyle(status) {
    if (status === "approved") {
      return "bg-emerald-50 text-emerald-600";
    }

    if (status === "rejected") {
      return "bg-red-50 text-red-600";
    }

    return "bg-amber-50 text-amber-600";
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Reviews
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage customer reviews and ratings for Clover Clothing.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <MessageSquare className="h-5 w-5 text-emerald-600" />
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Total Reviews
          </p>

          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {totalReviews}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Average Rating
          </p>

          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {averageRating}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <Check className="h-5 w-5 text-blue-600" />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Approved
          </p>

          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {approvedReviews}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
            <MessageSquare className="h-5 w-5 text-orange-600" />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Pending
          </p>

          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {pendingReviews}
          </p>
        </div>

      </div>

      {/* Search / Filter */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
          >
            <option value="all">All Reviews</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

        </div>

      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading reviews...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-100 bg-white p-8 text-center">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>

          <button
            onClick={fetchReviews}
            className="mt-3 text-sm font-medium text-emerald-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Reviews */}
      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">

          {filteredReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">

              <MessageSquare className="h-10 w-10 text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-600">
                No reviews found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Customer reviews will appear here.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-5 transition hover:bg-slate-50/50"
                >

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    {/* Customer */}
                    <div className="flex min-w-0 gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                        <User className="h-5 w-5 text-emerald-600" />
                      </div>

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <p className="text-sm font-semibold text-slate-800">
                            {review.customer}
                          </p>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${statusStyle(
                              review.status
                            )}`}
                          >
                            {review.status}
                          </span>

                        </div>

                        {review.email && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {review.email}
                          </p>
                        )}

                        <div className="mt-2">
                          {renderStars(review.rating)}
                        </div>

                      </div>

                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">

                      {review.status !== "approved" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              review.id,
                              "approved"
                            )
                          }
                          title="Approve"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}

                      {review.status !== "rejected" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              review.id,
                              "rejected"
                            )
                          }
                          title="Reject"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        onClick={() =>
                          deleteReview(review.id)
                        }
                        title="Delete"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>

                  </div>

                  {/* Product */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">

                    <Package className="h-4 w-4 text-slate-400" />

                    <span>
                      Product:
                    </span>

                    <span className="font-medium text-slate-700">
                      {review.product}
                    </span>

                  </div>

                  {/* Comment */}
                  <div className="mt-3 rounded-lg bg-slate-50 p-4">

                    <p className="text-sm leading-6 text-slate-600">
                      "{review.comment}"
                    </p>

                  </div>

                  {/* Date */}
                  {review.createdAt && (
                    <p className="mt-3 text-xs text-slate-400">
                      {new Date(
                        review.createdAt
                      ).toLocaleString()}
                    </p>
                  )}

                </div>
              ))}

            </div>
          )}

        </div>
      )}

    </div>
  );
}