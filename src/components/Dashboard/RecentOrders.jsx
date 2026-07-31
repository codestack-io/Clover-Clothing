import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  delivered: "bg-emerald-50 text-emerald-600",
  processing: "bg-amber-50 text-amber-600",
  pending: "bg-slate-100 text-slate-600",
  shipped: "bg-blue-50 text-blue-600",
  cancelled: "bg-red-50 text-red-600",
};

function formatStatus(status) {
  if (!status) return "Pending";

  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function getOrderNumber(id) {
  if (!id) return "------";

  return id.toString().slice(-6).toUpperCase();
}

function formatAmount(amount) {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
}

export default function RecentOrdersTable({ orders = [] }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm font-medium text-slate-500">
          No orders yet
        </p>

        <p className="mt-1 text-xs text-slate-400">
          New orders will show up here as they come in.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">

        {/* Table Header */}

        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">

            <th className="pb-3 font-medium">
              Order
            </th>

            <th className="pb-3 font-medium">
              Customer
            </th>

            <th className="pb-3 font-medium">
              Amount
            </th>

            <th className="pb-3 font-medium">
              Status
            </th>

          </tr>
        </thead>

        {/* Table Body */}

        <tbody>
          {orders.map((order) => {
            const status = (
              order.deliveryStatus ||
              "pending"
            ).toLowerCase();

            const displayStatus = formatStatus(status);

            return (
              <tr
                key={order.id}
                className="border-b border-slate-50 last:border-0"
              >

                {/* Order */}

                <td className="py-3 font-medium text-slate-700">
                  #{getOrderNumber(order.id)}
                </td>

                {/* Customer */}

                <td className="max-w-[180px] truncate py-3 text-slate-500">
                  {order.customer || "Guest"}
                </td>

                {/* Amount */}

                <td className="py-3 font-medium text-slate-700">
                  {formatAmount(order.amount)}
                </td>

                {/* Status */}

                <td className="py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      STATUS_STYLES[status] ||
                        "bg-slate-100 text-slate-600"
                    )}
                  >
                    {displayStatus}
                  </span>
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}