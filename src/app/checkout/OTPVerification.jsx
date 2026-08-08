"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";

const OTPVerification = ({
  phone,
  onVerified,
  onBack,
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Swal.fire({
        icon: "warning",
        title: "Invalid OTP",
        text: "Please enter the 6-digit OTP.",
      });

      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          otp,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        Swal.fire({
          icon: "error",
          title: "Verification failed",
          text: data.message || "Invalid OTP.",
        });

        return;
      }

      Swal.fire({
        icon: "success",
        title: "Phone verified",
        text: "Your phone number has been verified successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      onVerified(data.phone);

    } catch (error) {
      console.error("OTP VERIFY ERROR:", error);

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] px-4 py-10">

      <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">

        <div className="w-full rounded-3xl border border-neutral-200 bg-white p-7 shadow-xl sm:p-9">

          {/* ICON */}

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100">
            <ShieldCheck
              size={27}
              className="text-neutral-800"
            />
          </div>

          {/* TITLE */}

          <div className="mt-6 text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Secure checkout
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              Verify your phone
            </h1>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              We've sent a verification code to
            </p>

            <p className="mt-1 font-semibold text-neutral-900">
              {phone}
            </p>

          </div>

          {/* OTP */}

          <div className="mt-8">

            <label className="mb-2 block text-sm font-medium text-neutral-700">
              Enter 6-digit OTP
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value.replace(/\D/g, "")
                )
              }
              placeholder="••••••"
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-center text-2xl font-semibold tracking-[0.5em] outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
            />

          </div>

          {/* VERIFY */}

          <button
            onClick={handleVerify}
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-4 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loading ? (
              "Verifying..."
            ) : (
              <>
                <CheckCircle2 size={18} />
                Verify Phone
              </>
            )}

          </button>

          {/* DEVELOPMENT NOTICE */}

          <div className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-center text-xs text-amber-700">
            Development OTP: <strong>123456</strong>
          </div>

          {/* BACK */}

          <button
            onClick={onBack}
            className="mx-auto mt-6 flex items-center gap-2 text-sm text-neutral-500 transition hover:text-black"
          >
            <ArrowLeft size={16} />
            Change phone number
          </button>

        </div>

      </div>

    </div>
  );
};

export default OTPVerification;