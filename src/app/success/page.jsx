"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function Success() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const method = searchParams.get("method"); 

  useEffect(() => {
    const handleSuccess = async () => {
      if (!session_id && method !== "stripe") {
        // If online payment, session_id is required
        await Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Invalid or missing session. Please try again.",
          confirmButtonText: "Go Home",
        });
        window.location.href = "/";
        return;
      }

      try {
        // ✅ Call order creation API
        const res = await fetch("/api/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentId: session_id || null,
            paymentMethod: method || "Unknown",
          }),
        });

        const text = await res.text();
console.log("Response:", text);

let data;
try {
  data = JSON.parse(text);
} catch (err) {
  console.error("Not JSON:", text);
}

        if (!data.success) {
          await Swal.fire({
            icon: "error",
            title: "Order Failed",
            text: "Something went wrong while creating your order.",
          });
          return;
        }

        // ✅ Show success message
        await Swal.fire({
          title: "Payment Successful! 🎉",
          html: `<p>Thank you for your purchase.</p>
                 <p>Payment Method: <strong>${method}</strong></p>
                 ${session_id ? `<p>Session ID: <strong>${session_id}</strong></p>` : ""}`,
          icon: "success",
          confirmButtonText: "View Orders",
        });

        // ✅ Redirect to orders page
        window.location.href = "/my-account/orders";
      } catch (error) {
        console.error(error);
        await Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong. Please contact support.",
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