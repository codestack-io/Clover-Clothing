"use client";

import { useEffect, useState } from "react";

import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchAnalytics() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/dashboard/analytics", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load analytics"
        );
      }

      setAnalytics(data);
    } catch (error) {
      console.error("Analytics error:", error);
      setError("Unable to load analytics data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-100" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl bg-white shadow-sm"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-80 animate-pulse rounded-xl bg-white shadow-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // ERROR
  // -----------------------------------------

  if (error || !analytics) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-xl border border-red-100 bg-white px-8 py-7 text-center shadow-sm">
          <p className="text-sm font-medium text-red-600">
            {error || "Something went wrong."}
          </p>

          <button
            onClick={fetchAnalytics}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:underline"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  const {
    totalOrders,
    totalProducts,
    totalRevenue,
    averageOrderValue,
  } = analytics.overview;

  const salesData = analytics.salesData || [];
  const statusData = analytics.statusData || [];
  const deliveryData = analytics.deliveryData || [];
  const bestSellingProducts =
    analytics.bestSellingProducts || [];
  const categoryData = analytics.categoryData || [];

  return (
    <div className="space-y-6">

      {/* -------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------- */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor your Clover Clothing store performance.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* -------------------------------- */}
      {/* OVERVIEW CARDS */}
      {/* -------------------------------- */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <AnalyticsCard
          icon={DollarSign}
          title="Total Revenue"
          value={`৳${Number(totalRevenue).toLocaleString()}`}
        />

        <AnalyticsCard
          icon={ShoppingCart}
          title="Total Orders"
          value={Number(totalOrders).toLocaleString()}
        />

        <AnalyticsCard
          icon={Package}
          title="Total Products"
          value={Number(totalProducts).toLocaleString()}
        />

        <AnalyticsCard
          icon={TrendingUp}
          title="Average Order"
          value={`৳${Number(
            averageOrderValue
          ).toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`}
        />

      </div>

      {/* -------------------------------- */}
      {/* SALES OVERVIEW */}
      {/* -------------------------------- */}

      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-800">
            Sales Overview
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Revenue and orders over time
          </p>
        </div>

        {salesData.length === 0 ? (
          <EmptyChart text="No sales data available yet." />
        ) : (
          <div className="h-[340px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={salesData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#94a3b8",
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#94a3b8",
                  }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return [
                        `৳${Number(value).toLocaleString()}`,
                        "Revenue",
                      ];
                    }

                    return [value, "Orders"];
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />

              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>

      {/* -------------------------------- */}
      {/* ORDERS + DELIVERY */}
      {/* -------------------------------- */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Order Status */}

        <ChartCard
          title="Order Status"
          subtitle="Current order status distribution"
        >
          {statusData.length === 0 ? (
            <EmptyChart text="No order data available." />
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>

                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={105}
                    innerRadius={60}
                    paddingAngle={3}
                  >
                    {statusData.map(
                      (entry, index) => (
                        <Cell
                          key={`status-${index}`}
                          fill={
                            PIE_COLORS[
                              index %
                                PIE_COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                  />

                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        {/* Delivery Status */}

        <ChartCard
          title="Delivery Status"
          subtitle="Order delivery performance"
        >
          {deliveryData.length === 0 ? (
            <EmptyChart text="No delivery data available." />
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={deliveryData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "#94a3b8",
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "#94a3b8",
                    }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    name="Orders"
                    fill="#10b981"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                  />

                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

      </div>

      {/* -------------------------------- */}
      {/* BEST SELLING PRODUCTS */}
      {/* -------------------------------- */}

      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-800">
            Best Selling Products
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Products ranked by units sold
          </p>
        </div>

        {bestSellingProducts.length === 0 ? (
          <EmptyChart text="No product sales data available." />
        ) : (
          <div className="h-[350px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={bestSellingProducts}
                layout="vertical"
                margin={{
                  left: 30,
                  right: 20,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f1f5f9"
                />

                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={160}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#64748b",
                  }}
                />

                <Tooltip />

                <Bar
                  dataKey="sold"
                  name="Units Sold"
                  fill="#059669"
                  radius={[
                    0,
                    6,
                    6,
                    0,
                  ]}
                />

              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>

      {/* -------------------------------- */}
      {/* PRODUCT CATEGORIES */}
      {/* -------------------------------- */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <ChartCard
          title="Product Types"
          subtitle="Products grouped by cotton type"
        >
          {categoryData.length === 0 ? (
            <EmptyChart text="No category data available." />
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>

                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={105}
                    innerRadius={55}
                    paddingAngle={3}
                  >
                    {categoryData.map(
                      (entry, index) => (
                        <Cell
                          key={`category-${index}`}
                          fill={
                            PIE_COLORS[
                              index %
                                PIE_COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                  />

                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">

          <h2 className="text-sm font-semibold text-slate-800">
            Top Products
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Highest selling products
          </p>

          <div className="mt-5 space-y-4">

            {bestSellingProducts
              .slice(0, 5)
              .map((product, index) => (
                <div
                  key={`${product.name}-${index}`}
                  className="flex items-center gap-3"
                >

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-sm font-semibold text-emerald-600">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {product.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {product.sold} units sold
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-slate-800">
                    ৳
                    {Number(
                      product.revenue
                    ).toLocaleString()}
                  </p>

                </div>
              ))}

          </div>

        </div>

      </div>

    </div>
  );
}

// -----------------------------------------
// COMPONENTS
// -----------------------------------------

function AnalyticsCard({
  icon: Icon,
  title,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
          <Icon className="h-5 w-5 text-emerald-600" />
        </div>

      </div>

      <p className="mt-4 text-xs font-medium text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>

    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">

      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-800">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          {subtitle}
        </p>
      </div>

      {children}

    </div>
  );
}

function EmptyChart({ text }) {
  return (
    <div className="flex h-[280px] items-center justify-center">
      <div className="text-center">
        <p className="text-sm font-medium text-slate-500">
          {text}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Data will appear here when available.
        </p>
      </div>
    </div>
  );
}

const PIE_COLORS = [
  "#059669",
  "#10b981",
  "#34d399",
  "#6ee7b7",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#ef4444",
];