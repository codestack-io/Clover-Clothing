"use client";
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import RecentOrdersTable from "@/components/Dashboard/RecentOrders";
import LatestProducts from "@/components/Dashboard/LatestProduct";
import ChartPlaceholder from "@/components/Dashboard/ChatPlaceholder";

const STATS = [
  { icon: Package, title: "Total Products", value: "1,284", growth: 8.2 },
  { icon: ShoppingCart, title: "Total Orders", value: "3,542", growth: 12.5 },
  { icon: DollarSign, title: "Revenue", value: "$48,230", growth: 5.1 },
  { icon: Users, title: "Customers", value: "2,109", growth: -2.4 },
];

const RECENT_ORDERS = [
  { id: "10234", customer: "Ayesha Rahman", amount: "89.00", status: "Delivered" },
  { id: "10235", customer: "Tanvir Islam", amount: "142.50", status: "Processing" },
  { id: "10236", customer: "Nabila Chowdhury", amount: "56.00", status: "Shipped" },
  { id: "10237", customer: "Fahim Ahmed", amount: "230.00", status: "Cancelled" },
];

const LATEST_PRODUCTS = [
  { id: 1, name: "Classic Oxford Shirt", category: "Shirts", price: "34.99" },
  { id: 2, name: "Slim Fit Chinos", category: "Trousers", price: "42.00" },
  { id: 3, name: "Merino Wool Sweater", category: "Knitwear", price: "58.50" },
];

export default function DashboardHomePage() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Orders + Latest Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Recent Orders</h2>
            <button className="text-xs font-medium text-emerald-600 hover:underline">View all</button>
          </div>
          <RecentOrdersTable orders={RECENT_ORDERS} />
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Latest Products</h2>
            <button className="text-xs font-medium text-emerald-600 hover:underline">View all</button>
          </div>
          <LatestProducts products={LATEST_PRODUCTS} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">Sales Overview</h2>
          <ChartPlaceholder label="Sales chart" />
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">Best Selling Products</h2>
          <ChartPlaceholder label="Best sellers chart" />
        </div>
      </div>
    </div>
  );
}