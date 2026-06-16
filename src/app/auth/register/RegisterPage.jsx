"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import SocialButton from "@/components/Buttons/SocialButton";
import Swal from "sweetalert2";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const callBackUrl = params.get("callbackUrl") || "/";

  // Upload image to ImgBB
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
      let imageUrl =
        "https://i.ibb.co/4pDNDk1/avatar.png";

      // 🔥 upload image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // update profile
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: imageUrl,
      });

      Swal.fire({
        title: "Success!",
        text: "Account created successfully",
        icon: "success",
      });

      router.push(callBackUrl);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6">
        Create New Account
      </h2>

      <form onSubmit={handleRegister} className="space-y-4">

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          className="w-full border p-3 rounded-lg"
          required
        />

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

        {/* 🔥 GALLERY IMAGE INPUT */}
        <input
          type="file"
          accept="image/*"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => {
  const file = e.target.files[0];
  setImageFile(file);
  setPreview(URL.createObjectURL(file)); // ONLY for UI preview
}}

        />

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <div className="text-center mt-4">
        <SocialButton callbackUrl={callBackUrl} />
      </div>

      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link
          href={`/auth/login?callbackUrl=${encodeURIComponent(callBackUrl)}`}
          className="text-black font-semibold"
        >
          Login
        </Link>
      </p>
    </>
  );
}