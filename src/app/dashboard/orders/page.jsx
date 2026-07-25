// src/app/dashboard/orders/page.jsx
import { ShoppingCart } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";

export default function OrdersPage() {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="No orders yet"
      description="Order management is coming soon. Incoming orders will show up here for tracking and fulfillment."
    />
  );
}