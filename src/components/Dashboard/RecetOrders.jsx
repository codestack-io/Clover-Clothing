import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  Delivered: "bg-emerald-50 text-emerald-600",
  Processing: "bg-amber-50 text-amber-600",
  Cancelled: "bg-red-50 text-red-600",
  Shipped: "bg-blue-50 text-blue-600",
};

export default function RecentOrdersTable({ orders = [] }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm font-medium text-slate-500">No orders yet</p>
        <p className="mt-1 text-xs text-slate-400">New orders will show up here as they come in.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
            <th className="pb-3 font-medium">Order</th>
            <th className="pb-3 font-medium">Customer</th>
            <th className="pb-3 font-medium">Amount</th>
            <th className="pb-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-slate-50 last:border-0">
              <td className="py-3 font-medium text-slate-700">#{order.id}</td>
              <td className="py-3 text-slate-500">{order.customer}</td>
              <td className="py-3 font-medium text-slate-700">${order.amount}</td>
              <td className="py-3">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    STATUS_STYLES[order.status] || "bg-slate-100 text-slate-600"
                  )}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}