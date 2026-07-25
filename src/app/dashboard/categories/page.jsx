// src/app/dashboard/categories/page.jsx
import { FolderTree } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";

export default function CategoriesPage() {
  return (
    <EmptyState
      icon={FolderTree}
      title="No categories yet"
      description="Category management is coming soon. Organize your catalog into collections and categories here."
    />
  );
}