"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Mail,
  ShoppingBag,
  DollarSign,
  UserRound,
} from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchCustomers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/dashboard/customers", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load customers");
      }

      setCustomers(data.customers || []);
    } catch (error) {
      console.error("Customers fetch error:", error);
      setError("Unable to load customers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  // --------------------------------
  // SEARCH
  // --------------------------------

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      customer.name?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query)
    );
  });

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-100" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl border border-slate-100 bg-white shadow-sm"
            />
          ))}
        </div>

        {/* Search skeleton */}
        <div className="h-16 animate-pulse rounded-xl border border-slate-100 bg-white shadow-sm" />

        {/* Table skeleton */}
        <div className="h-96 animate-pulse rounded-xl border border-slate-100 bg-white shadow-sm" />
      </div>
    );
  }

  // --------------------------------
  // ERROR
  // --------------------------------

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-xl border border-red-100 bg-white px-8 py-7 text-center shadow-sm">
          <Users className="mx-auto h-8 w-8 text-red-400" />

          <p className="mt-3 text-sm font-medium text-red-600">
            {error}
          </p>

          <button
            onClick={fetchCustomers}
            className="mt-4 text-sm font-medium text-emerald-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------
  // STATS
  // --------------------------------

  const totalCustomers = customers.length;

  const totalOrders = customers.reduce(
    (sum, customer) => sum + (Number(customer.orders) || 0),
    0
  );

  const totalSpent = customers.reduce(
    (sum, customer) => sum + (Number(customer.totalSpent) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* -------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------- */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Customers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and view your Clover Clothing customers.
          </p>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* SUMMARY CARDS */}
      {/* -------------------------------- */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Customers */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>

            <span className="text-xs font-medium text-emerald-600">
              Customers
            </span>
          </div>

          <p className="mt-4 text-2xl font-semibold text-slate-900">
            {totalCustomers.toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Registered customers
          </p>
        </div>

        {/* Orders */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>

            <span className="text-xs font-medium text-blue-600">
              Orders
            </span>
          </div>

          <p className="mt-4 text-2xl font-semibold text-slate-900">
            {totalOrders.toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Orders from customers
          </p>
        </div>

        {/* Spending */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>

            <span className="text-xs font-medium text-amber-600">
              Spending
            </span>
          </div>

          <p className="mt-4 text-2xl font-semibold text-slate-900">
            ৳{totalSpent.toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Total customer spending
          </p>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* SEARCH */}
      {/* -------------------------------- */}

      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {/* -------------------------------- */}
      {/* CUSTOMER TABLE */}
      {/* -------------------------------- */}

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Customer
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Email
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Provider
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Orders
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Spent
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Joined
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-slate-50 transition hover:bg-slate-50/50"
                >
                  {/* Customer */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-50">
                        {customer.image ? (
                          <img
                            src={customer.image}
                            alt={customer.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserRound className="h-5 w-5 text-emerald-600" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {customer.name || "Unknown Customer"}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          ID: {customer.id.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" />

                      <span className="text-sm text-slate-600">
                        {customer.email || "—"}
                      </span>
                    </div>
                  </td>

                  {/* Provider */}
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                      {customer.provider || "credentials"}
                    </span>
                  </td>

                  {/* Orders */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-slate-700">
                      {Number(customer.orders || 0).toLocaleString()}
                    </span>
                  </td>

                  {/* Total Spent */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-slate-800">
                      ৳
                      {Number(customer.totalSpent || 0).toLocaleString()}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm text-slate-500">
                      {customer.createdAt
                        ? new Date(customer.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* -------------------------------- */}
        {/* EMPTY STATE */}
        {/* -------------------------------- */}

        {filteredCustomers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
              <Users className="h-6 w-6 text-slate-300" />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-600">
              {search
                ? "No customers found"
                : "No customers yet"}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {search
                ? "Try a different search."
                : "Registered customers will appear here."}
            </p>
          </div>
        )}
      </div>

      {/* -------------------------------- */}
      {/* RESULT COUNT */}
      {/* -------------------------------- */}

      {filteredCustomers.length > 0 && (
        <div className="text-xs text-slate-400">
          Showing{" "}
          <span className="font-medium text-slate-600">
            {filteredCustomers.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-600">
            {customers.length}
          </span>{" "}
          customers
        </div>
      )}
    </div>
  );
}