"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function MyAccount() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?callbackUrl=/my-account");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="bg-white rounded-2xl shadow p-8 flex flex-col sm:flex-row items-center gap-6 mb-6">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-green-200 flex-shrink-0">
          <Image
            src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
            alt="Profile"
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user.displayName || "User"}</h2>
          <p className="text-gray-500">{user.email}</p>
          <span className="badge badge-success text-white mt-1">Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/my-account/orders"
          className="bg-white rounded-xl shadow p-5 hover:shadow-md transition text-center"
        >
          <p className="text-2xl font-bold text-green-600">📦</p>
          <p className="font-semibold mt-1">My Orders</p>
          <p className="text-gray-400 text-sm">Track & view orders</p>
        </Link>
        <Link
          href="/add-product"
          className="bg-white rounded-xl shadow p-5 hover:shadow-md transition text-center"
        >
          <p className="text-2xl font-bold text-blue-500">➕</p>
          <p className="font-semibold mt-1">Add Product</p>
          <p className="text-gray-400 text-sm">List a new item</p>
        </Link>
        <Link
          href="/manage-products"
          className="bg-white rounded-xl shadow p-5 hover:shadow-md transition text-center"
        >
          <p className="text-2xl font-bold text-purple-500">⚙️</p>
          <p className="font-semibold mt-1">Manage Products</p>
          <p className="text-gray-400 text-sm">View, delete items</p>
        </Link>
      </div>

      <button
        onClick={logout}
        className="btn btn-error btn-outline w-full"
      >
        Logout
      </button>
    </div>
  );
}
