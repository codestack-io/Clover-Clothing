"use client";

export default function OrderCard({ order }) {
  const items = order.items || [];

  const total = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <div className="bg-white shadow rounded-xl p-6 mb-4">
      {/* Order Info */}
      <h2 className="font-semibold text-lg mb-1">
        Order ID: {order._id}
      </h2>

      <p className="text-gray-500 text-sm mb-3">
        Placed on:{" "}
        {order.createdAt
          ? new Date(order.createdAt).toLocaleDateString()
          : "N/A"}
      </p>

      {/* Items */}
      <div className="divide-y">
        {items.length > 0 ? (
          items.map((p, index) => (
            <div
              key={index}
              className="py-3 flex items-center justify-between gap-4"
            >
              {/* LEFT: Image + Name */}
              <div className="flex items-center gap-3">
                <img
                  src={p.image || "/placeholder.png"}
                  alt={p.name || "Product"}
                  className="w-12 h-12 object-cover rounded-md border"
                />

                <div className="text-sm">
                  <p className="font-medium">
                    {p.name || "Product"}
                  </p>
                  <p className="text-gray-500">
                    Qty: {p.quantity || 1}
                  </p>
                </div>
              </div>

              {/* RIGHT: Price */}
              <div className="text-sm font-medium">
                ৳{(p.price || 0) * (p.quantity || 1)}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No items found</p>
        )}
      </div>

      {/* Total */}
      <p className="text-right font-semibold mt-3 border-t pt-2">
       Total: ৳{total}
      </p>
    </div>
  );
}