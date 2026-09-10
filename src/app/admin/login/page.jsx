"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: "Invalid admin credentials",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Welcome back, Admin!",
      timer: 1500,
      showConfirmButton: false,
    });

    // Send admin straight to the dashboard
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
        Admin Access
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Admin Email"
          className="w-full border p-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          {loading ? "Authenticating..." : "Sign In to Dashboard"}
        </button>
      </form>
    </div>
  );
}