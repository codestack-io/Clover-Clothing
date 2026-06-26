"use client";

import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

export default function SocialButton({ callbackUrl = "/" }) {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl })}
      className="btn btn-outline w-full"
    >
      <FaGoogle className="mr-2 text-lg" />
      Continue with Google
    </button>
  );
}