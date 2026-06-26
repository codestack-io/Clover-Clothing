"use client";

import { clearCart } from "../../action/server/cart";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const session_id = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");
  const method = searchParams.get("method");

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const handleSuccess = async () => {
      if (method === "stripe" && !session_id) {
        await Swal.fire({
          icon: "error",
          title: "Invalid payment",
          text: "Missing Stripe session.",
        });
        window.location.href = "/";
        return;
      }

      try {
        // ✅ Update order (for Stripe or others)
        const res = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            paymentId: session_id,
            paymentMethod: method,
          }),
        });

        const data = await res.json();

        if (!data?.success) {
          await Swal.fire({
            icon: "error",
            title: "Order Failed",
            text: data?.error || "Something went wrong.",
          });
          return;
        }

        // ✅ Fetch updated order
        const orderRes = await fetch(`/api/orders/${orderId}`);
        const orderData = await orderRes.json();

        if (orderData.success) {
          setOrder(orderData.order);

          // 🔥 CLEAR CART HERE
        await clearCart();

          // 🔥 FORCE UI REFRESH
          router.refresh();
        }

        // ✅ Success message
        await Swal.fire({
          title: "Payment Successful 🎉",
          html: `
            <p>Thank you for your purchase.</p>
            <p><strong>Method:</strong> ${method}</p>
            ${
              session_id
                ? `<p><strong>Session:</strong> ${session_id}</p>`
                : ""
            }
          `,
          icon: "success",
        });

      } catch (error) {
        console.error("🔥 Error:", error);
        await Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong.",
        });
      }
    };

    if (orderId) {
      handleSuccess();
    }
  }, [session_id, method, orderId, router]);

 return (
  <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-10 overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient">

    {/* Background blobs */}
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute w-48 h-48 sm:w-72 sm:h-72 bg-purple-400 rounded-full blur-3xl opacity-30 top-10 left-5 sm:left-10"></div>
      <div className="absolute w-48 h-48 sm:w-72 sm:h-72 bg-pink-400 rounded-full blur-3xl opacity-30 top-40 right-5 sm:right-10"></div>
      <div className="absolute w-48 h-48 sm:w-72 sm:h-72 bg-indigo-400 rounded-full blur-3xl opacity-30 bottom-10 left-1/2"></div>
    </div>

    {/* Title */}
    <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-6 text-center">
      Processing your payment...
    </h1>

   {/* ORDER CARD */}
{order && (
  <div className="w-full max-w-4xl bg-white/80 backdrop-blur-lg p-4 sm:p-6 rounded-2xl shadow-xl border border-white/30">

    <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 text-center sm:text-left">
      Order Details
    </h2>

    {/* ===================== */}
    {/* DESKTOP TABLE */}
    {/* ===================== */}
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full text-sm border-collapse rounded-xl overflow-hidden">

        <thead>
          <tr className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
            <th className="p-3 text-left">Product</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Price</th>
            <th className="p-3">Delivery</th>
          </tr>
        </thead>

        <tbody>
          {order?.items?.map((item, index) => (
            <tr
              key={index}
              className="text-center odd:bg-white/60 even:bg-gray-100/60 hover:bg-purple-100 transition"
            >
              <td className="p-3 text-left font-medium text-gray-800">
                {item.title}
              </td>

              <td className="p-3 text-gray-700">
                {item.quantity}
              </td>

              <td className="p-3 font-semibold text-indigo-600">
                ৳{item.price}
              </td>

              <td className="p-3">
                {order.deliveryStatus === "delivered" ? (
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                    Delivered
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                    On the way
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* ===================== */}
    {/* MOBILE CARDS */}
    {/* ===================== */}
    <div className="sm:hidden space-y-4">
      {order?.items?.map((item, index) => (
        <div
          key={index}
          className="border rounded-xl p-4 bg-white shadow-sm"
        >
          <h3 className="font-semibold text-gray-800">
            {item.title}
          </h3>

          <div className="mt-2 text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Quantity:</span>{" "}
              {item.quantity}
            </p>

            <p>
              <span className="font-medium">Price:</span>{" "}
              ৳{item.price}
            </p>

            <p className="flex items-center gap-2">
              <span className="font-medium">Status:</span>

              {order.deliveryStatus === "delivered" ? (
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                  Delivered
                </span>
              ) : (
                <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                  On the way
                </span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>

  </div>
)}
  </div>
);
}