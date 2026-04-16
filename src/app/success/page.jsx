"use client";
import { clearCart } from "@/Action/Server/cart"; 
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function Success() {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Processing your payment...
      </h1>

      {order && (
        <div className="w-full max-w-4xl bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Delivery Status</th>
              </tr>
            </thead>

            <tbody>
              {order?.items?.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="p-2 border">{item.title}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">${item.price}</td>
                  <td className="p-2 border">
                    {order.deliveryStatus === "delivered" ? (
                      <span className="text-green-600 font-semibold">
                        Delivered
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">
                        On the way
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}