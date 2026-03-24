"use client"; // Must be first line

import { useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Next.js 16 client hook
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function Success() {
  const searchParams = useSearchParams(); // hook returns a URLSearchParams object
  const session_id = searchParams.get("session_id"); // ✅ safely get session_id

  useEffect(() => {
    if (!session_id) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Invalid or missing session. Please try again.",
        confirmButtonText: "Go Home",
      }).then(() => window.location.href = "/");
      return;
    }

    Swal.fire({
      title: "Payment Successful! 🎉",
      html: `<p>Thank you for your purchase.</p><p>Session ID: <strong>${session_id}</strong></p>`,
      icon: "success",
      confirmButtonText: "View Orders",
    }).then(() => window.location.href = "/my-account/orders");
  }, [session_id]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-800">
        Processing your payment...
      </h1>
    </div>
  );
}