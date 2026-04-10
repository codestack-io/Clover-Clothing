"use client";

import { useState } from "react";
import { useRouter,useSearchParams } from "next/navigation";
import { postuser } from "@/Action/Server/auth";
import { signIn } from "next-auth/react";  
import SocialButton from "@/components/Buttons/SocialButton";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const router = useRouter();
   const params = useSearchParams(); 
  const [loading, setLoading] = useState(false);
  const callBackUrl = params.get("callbackUrl") || "/";

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
  const email = formData.get("email").toLowerCase();
  const password = formData.get("password");

  const payload = { name, email, password };

    const registerResult = await postuser(payload);
    

    if (registerResult ?.insertedId) {
   
    const result= await signIn("credentials", {
      email,
      password,
      redirect:false,
      callbackUrl: callBackUrl,
    });
    if(result.ok)
    Swal.fire("success,Registered successfully");
    router.push(callBackUrl);
  } else {
    Swal.fire("Registration failed or user already exists.");
  }
  setLoading(false);
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6">
        Create New Account
      </h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <input name="name" type="text" placeholder="Full Name" className="w-full border p-3 rounded-lg" required />
        <input name="email" type="email" placeholder="Email" className="w-full border p-3 rounded-lg" required />
        <input name="password" type="password" placeholder="Password" className="w-full border p-3 rounded-lg" required />

        <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg">
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <div className="text-center mt-4">
        
        <SocialButton></SocialButton>
      </div>

      <p className="text-center mt-4">
        Already have an account?{" "}
        <span onClick={() => router.push("/auth/login")} className="text-black font-semibold cursor-pointer">
          Login
        </span>
      </p>
    </>
  );
}