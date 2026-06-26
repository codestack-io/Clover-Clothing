"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import Link from "next/link";

const STARS = [1, 2, 3, 4, 5];

const mockReviews = [
  {
    id: 1,
    name: "Rahul Ahmed",
    avatar: "https://i.pravatar.cc/48?u=rahul",
    rating: 5,
    date: "June 2025",
    text: "Absolutely love the quality! The Soft Cotton kurta is incredibly comfortable and the stitching is flawless.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    avatar: "https://i.pravatar.cc/48?u=priya",
    rating: 4,
    date: "May 2025",
    text: "Great fabric and fast delivery. The Silk Cotton feels premium. Would love more colour options.",
  },
  {
    id: 3,
    name: "Tanvir Hossain",
    avatar: "https://i.pravatar.cc/48?u=tanvir",
    rating: 5,
    date: "April 2025",
    text: "Best Punjabi I've bought online. The fit is perfect and the green colour is exactly as shown.",
  },
];

export default function ReviewPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(mockReviews);
  const [form, setForm] = useState({ rating: 5, text: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please log in to leave a review.",
        icon: "warning",
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#16a34a",
      }).then((result) => {
        if (result.isConfirmed) window.location.href = "/auth/login?callbackUrl=/review";
      });
      return;
    }

    if (!form.text.trim()) {
      Swal.fire({ title: "Please write your review", icon: "warning" });
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const newReview = {
      id: Date.now(),
      name: user.displayName || user.email,
      avatar: user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png",
      rating: form.rating,
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      text: form.text,
    };

    setReviews((prev) => [newReview, ...prev]);
    setForm({ rating: 5, text: "" });
    setSubmitting(false);

    Swal.fire({
      title: "Review Submitted!",
      text: "Thank you for your feedback.",
      icon: "success",
      timer: 1800,
      showConfirmButton: false,
    });
  };

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Customer Reviews</h1>
      <p className="text-gray-500 mb-8">
        ⭐ {avgRating} / 5 — based on {reviews.length} reviews
      </p>

      {/* Submit Review Form */}
      <div className="bg-white rounded-2xl shadow p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {user ? "Leave a Review" : "Log in to leave a review"}
        </h2>

        {!user && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            <Link href="/auth/login?callbackUrl=/review" className="font-semibold underline">
              Log in
            </Link>{" "}
            or{" "}
            <Link href="/auth/register?callbackUrl=/review" className="font-semibold underline">
              register
            </Link>{" "}
            to submit a review.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {STARS.map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, rating: star }))}
                  className={`text-2xl transition ${
                    star <= form.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500 self-center">{form.rating} / 5</span>
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
            <textarea
              rows={4}
              value={form.text}
              onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
              placeholder="Share your experience with Clover Clothing..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{review.name}</p>
                <p className="text-xs text-gray-400">{review.date}</p>
              </div>
              <div className="ml-auto text-yellow-400 text-sm">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
