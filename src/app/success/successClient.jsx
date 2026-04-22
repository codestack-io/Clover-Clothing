"use client";

import { clearCart } from "@/action/server/cart";
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
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient">
      <div className="absolute inset-0 -z-10 overflow-hidden">
  <div className="absolute w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob top-10 left-10"></div>
  <div className="absolute w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 top-40 right-10"></div>
  <div className="absolute w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 bottom-10 left-1/2"></div>
</div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Processing your payment...
      </h1>

      {order && (
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/30">
  <h2 className="text-xl font-bold mb-4 text-gray-800">
    Order Details
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full border-collapse overflow-hidden rounded-xl">
      
      {/* HEADER */}
      <thead>
        <tr className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
          <th className="p-3 text-left">Product</th>
          <th className="p-3">Quantity</th>
          <th className="p-3">Price</th>
          <th className="p-3">Delivery Status</th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody>
        {order?.items?.map((item, index) => (
          <tr
            key={index}
            className="text-center odd:bg-white/60 even:bg-gray-100/60 hover:bg-purple-100 transition"
          >
            <td className="p-3 font-medium text-gray-800 text-left">
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
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                  Delivered
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">
                  On the way
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
      )}
    </div>
  );
}