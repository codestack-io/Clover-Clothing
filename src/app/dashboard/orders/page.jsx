"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  Eye,
  X,
} from "lucide-react";

const STATUS_STYLES = {
  paid: "bg-emerald-50 text-emerald-600",
  pending: "bg-amber-50 text-amber-600",
  processing: "bg-blue-50 text-blue-600",
  cancelled: "bg-red-50 text-red-600",
  failed: "bg-red-50 text-red-600",
};

const DELIVERY_STYLES = {
  delivered: "bg-emerald-50 text-emerald-600",
  shipped: "bg-blue-50 text-blue-600",
  processing: "bg-amber-50 text-amber-600",
  pending: "bg-slate-100 text-slate-600",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  async function fetchOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/dashboard/orders", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load orders");
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error(error);
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();

    return (
      order.id.toLowerCase().includes(query) ||
      order.customer.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query) ||
      order.deliveryStatus.toLowerCase().includes(query)
    );
  });

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Orders
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage and monitor customer orders.
        </p>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-slate-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading orders...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-100 bg-white p-8 text-center">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>

          <button
            onClick={fetchOrders}
            className="mt-3 text-sm font-medium text-emerald-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px] text-left">

              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Order
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Delivery
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Date
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredOrders.map((order) => {

                  const paymentStatus =
                    order.status.toLowerCase();

                  const deliveryStatus =
                    order.deliveryStatus.toLowerCase();

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-slate-50 hover:bg-slate-50/50"
                    >

                      {/* Order */}
                      <td className="px-5 py-4">

                        <p className="text-sm font-semibold text-slate-800">
                          #{order.id.slice(-6).toUpperCase()}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </p>

                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">

                        <p className="text-sm text-slate-700">
                          {order.customer}
                        </p>

                        {order.city && (
                          <p className="mt-1 text-xs text-slate-400">
                            {order.city}
                          </p>
                        )}

                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                        ৳{order.totalPrice.toLocaleString()}
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            STATUS_STYLES[paymentStatus] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {order.status}
                        </span>

                        <p className="mt-2 text-xs text-slate-400">
                          {order.paymentMethod}
                        </p>

                      </td>

                      {/* Delivery */}
                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            DELIVERY_STYLES[deliveryStatus] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {order.deliveryStatus}
                        </span>

                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">

                        <button
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

          {/* Empty */}
          {filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">

              <ShoppingCart className="h-10 w-10 text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-600">
                No orders found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try a different search.
              </p>

            </div>
          )}

        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Order #{selectedOrder.id.slice(-6).toUpperCase()}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {formatDate(selectedOrder.createdAt)}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Details */}
            <div className="space-y-5 p-5">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Customer
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {selectedOrder.customer}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Phone
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {selectedOrder.phone || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Address
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {selectedOrder.address || "—"}
                </p>

                <p className="text-sm text-slate-500">
                  {selectedOrder.city}{" "}
                  {selectedOrder.postalCode}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Payment
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {selectedOrder.paymentMethod}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-slate-500">
                    Total
                  </span>

                  <span className="text-lg font-bold text-slate-900">
                    ৳{selectedOrder.totalPrice.toLocaleString()}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}