
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Swal from "sweetalert2";
import SocialButton from "../../../components/Buttons/SocialButton";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();

  const callbackUrl = params.get("callbackUrl") || "/";
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
        text: result.error,
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Logged in successfully",
      timer: 1500,
      showConfirmButton: false,
    });

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6">
        Login to Your Account
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <SocialButton callbackUrl={callbackUrl} />
      </form>

      <p className="text-center mt-4">
        Don't have an account?{" "}
        <Link
          href={`/auth/register?callbackUrl=${encodeURIComponent(
            callbackUrl
          )}`}
          className="text-black font-semibold"
        >
          Register
        </Link>
      </p>
    </>
  );
}

