"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();

  const callbackUrl = params.get("callbackUrl") || "/";

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      "https://api.imgbb.com/1/upload?key=ec7d3878dee39da01f6dcf93025a069a",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.data.url;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name");
    const email = formData.get("email").toLowerCase();
    const password = formData.get("password");

    try {
      let image =
        "https://i.ibb.co/4pDNDk1/avatar.png";

      if (imageFile) {
        image = await uploadImage(imageFile);
      }

      const register = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          image,
        }),
      });

      const data = await register.json();

      if (!register.ok) {
        throw new Error(data.error);
      }

      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (login?.error) {
        throw new Error(login.error);
      }

      await Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "Registration successful!",
      });

      router.push(callbackUrl);

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
    }

    setLoading(false);
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6">
        Create New Account
      </h2>

      <form onSubmit={handleRegister} className="space-y-4">

        <input
          name="name"
          required
          placeholder="Full Name"
          className="w-full border p-3 rounded-lg"
        />

        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full border p-3 rounded-lg"
        />

        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="file"
          accept="image/*"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => {
            const file = e.target.files[0];

            setImageFile(file);

            if (file) {
              setPreview(URL.createObjectURL(file));
            }
          }}
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-24 h-24 rounded-full object-cover mx-auto"
          />
        )}

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          {loading ? "Creating..." : "Register"}
        </button>

      </form>

      <p className="text-center mt-6">
        Already have an account?{" "}
        <Link
          href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="font-semibold"
        >
          Login
        </Link>
      </p>
    </>
  );
}