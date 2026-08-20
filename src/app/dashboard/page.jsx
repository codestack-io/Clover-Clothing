"use client";

import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
} from "lucide-react";

import StatCard from "../../components/Dashboard/StatCard";
import RecentOrdersTable from "../../components/Dashboard/RecentOrders";
import LatestProducts from "../../components/Dashboard/LatestProduct";
import BestSellingChart from "../../components/Dashboard/BestSellingChart";
import SalesChart from "../../components/Dashboard/SalesChart";

export default function DashboardHomePage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/dashboard");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        console.log(data);

        if (!data.success) {
          throw new Error(data.message || "Failed to load dashboard");
        }

        setDashboard(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  // --------------------------------
  // LOADING STATE
  // --------------------------------

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl border border-slate-100 bg-white"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-80 animate-pulse rounded-xl bg-white lg:col-span-2" />
          <div className="h-80 animate-pulse rounded-xl bg-white" />
        </div>
      </div>
    );
  }

  // --------------------------------
  // ERROR STATE
  // --------------------------------

  if (error || !dashboard) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-xl border border-red-100 bg-white px-6 py-5 text-center shadow-sm">
          <p className="text-sm font-medium text-red-600">
            {error || "Something went wrong."}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-sm font-medium text-emerald-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------
  // DATA
  // --------------------------------

  const {
    totalProducts,
    totalOrders,
    revenue,
    totalCustomers,
  } = dashboard.stats;

  const recentOrders = dashboard.recentOrders || [];

  const latestProducts = dashboard.latestProducts || [];
  const salesData = dashboard.salesData || [];
  const bestSelling = dashboard.bestSelling || [];

  // --------------------------------
  // STAT CARDS
  // --------------------------------

  const stats = [
    {
      icon: Package,
      title: "Total Products",
      value: totalProducts.toLocaleString(),
      growth: 0,
    },
    {
      icon: ShoppingCart,
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      growth: 0,
    },
    {
      icon: DollarSign,
      title: "Revenue",
      value: `৳${Number(revenue).toLocaleString()}`,
      growth: 0,
    },
    {
      icon: Users,
      title: "Customers",
      value: totalCustomers.toLocaleString(),
      growth: 0,
    },
  ];

  return (
    <div className="space-y-6">

      {/* -------------------------------- */}
      {/* STAT CARDS */}
      {/* -------------------------------- */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
          />
        ))}
      </div>

      {/* -------------------------------- */}
      {/* ORDERS + PRODUCTS */}
      {/* -------------------------------- */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Recent Orders */}

        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">

          <div className="mb-4 flex items-center justify-between">

            <h2 className="text-sm font-semibold text-slate-800">
              Recent Orders
            </h2>

            <button className="text-xs font-medium text-emerald-600 hover:underline">
              View all
            </button>

          </div>

          <RecentOrdersTable
            orders={recentOrders}
          />

        </div>

        {/* Latest Products */}

        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center justify-between">

            <h2 className="text-sm font-semibold text-slate-800">
              Latest Products
            </h2>

            <button className="text-xs font-medium text-emerald-600 hover:underline">
              View all
            </button>

          </div>

          <LatestProducts
            products={latestProducts}
          />

        </div>

      </div>

      {/* -------------------------------- */}
      {/* CHARTS */}
      {/* -------------------------------- */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">

          <h2 className="mb-4 text-sm font-semibold text-slate-800">
            Sales Overview
          </h2>

          <SalesChart data={salesData} />

        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">

          <h2 className="mb-4 text-sm font-semibold text-slate-800">
            Best Selling Products
          </h2>

          <BestSellingChart data={bestSelling} />

        </div>

      </div>

    </div>
  );
}