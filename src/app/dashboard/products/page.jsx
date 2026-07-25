// src/app/dashboard/products/page.jsx
import { Package } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";

export default function ProductsPage() {
  return (
    <EmptyState
      icon={Package}
      title="No products yet"
      description="Product management is coming soon. You'll be able to add, edit, and organize your catalog here."
    />
  );
}