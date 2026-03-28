"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function Success() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const orderId = searchParams.get("orderId"); 
  const method = searchParams.get("method"); 

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
        // ✅ Call backend to finalize order using session_id
        const res = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, paymentId: session_id ,paymentMethod: method}),
        });

        let data;
        try {
         const text = await res.text();   // read once
    data = JSON.parse(text);         // parse JSON
  } catch (err) {
    console.error("❌ Failed to parse response:", err);
    throw new Error("Server returned invalid response");
  }


        if (!data?.success) {
          await Swal.fire({
            icon: "error",
            title: "Order Failed",
            text: data?.error || "Something went wrong.",
          });
          return;
        }

        // ✅ SUCCESS ALERT
        await Swal.fire({
          title: "Payment Successful 🎉",
          html: `
            <p>Thank you for your purchase.</p>
            <p><strong>Method:</strong> ${method}</p>
            ${session_id ? `<p><strong>Session:</strong> ${session_id}</p>` : ""}
          `,
          icon: "success",
        });

        window.location.href = "/my-account/orders";

      } catch (error) {
        console.error("🔥 Error:", error);
        await Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong.",
        });
      }
    };

    handleSuccess();
  }, [session_id, method]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-800">
        Processing your payment...
      </h1>
    </div>
  );
}