// src/app/dashboard/reviews/page.jsx
import { Star } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";

export default function ReviewsPage() {
  return (
    <EmptyState
      icon={Star}
      title="No reviews yet"
      description="Customer reviews and ratings will be moderated and managed here."
    />
  );
}