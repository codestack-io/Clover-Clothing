// src/app/dashboard/analytics/page.jsx
import { BarChart3 } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";

export default function AnalyticsPage() {
  return (
    <EmptyState
      icon={BarChart3}
      title="Analytics coming soon"
      description="Sales trends, traffic, and customer insights will appear here once analytics is connected."
    />
  );
}