// src/app/dashboard/customers/page.jsx
import { Users } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";

export default function CustomersPage() {
  return (
    <EmptyState
      icon={Users}
      title="No customers yet"
      description="Customer management is coming soon. You'll be able to view profiles and order history here."
    />
  );
}