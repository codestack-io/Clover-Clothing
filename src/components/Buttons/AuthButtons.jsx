"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const AuthButtons = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) {
    return (
      <>
        <Link
          href={`/auth/login?callbackUrl=${pathname}`}
          className="btn btn-ghost"
        >
          Login
        </Link>

        <Link href="/auth/register" className="btn btn-primary">
          Register
        </Link>
      </>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost avatar">
        <div className="w-10 rounded-full">
          <img
            src={user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
            alt="user"
          />
        </div>
      </label>

      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-64"
      >
        {/* User Info */}
        <li className="pointer-events-none border-b pb-2 mb-2">
          <span className="font-bold">
            {user?.displayName || "User"}
          </span>
          <span className="text-xs text-gray-500">
            {user?.email}
          </span>
        </li>

        {/* Required Routes */}
        <li>
          <Link href="/add-product">Add Product</Link>
        </li>

        <li>
          <Link href="/manage-products">Manage Products</Link>
        </li>

        {/* Logout */}
        <li>
          <button onClick={logout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AuthButtons;