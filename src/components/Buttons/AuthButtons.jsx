"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const AuthButtons = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Optional loading state
  if (status === "loading") {
    return null;
  }

  // Not logged in
  if (!session) {
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

  const user = session.user;

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost avatar">
        <div className="w-10 rounded-full overflow-hidden">
          <img
            src={user?.image || "https://i.ibb.co/4pDNDk1/avatar.png"}
            alt={user?.name || "User"}
            className="w-full h-full object-cover"
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
            {user?.name || "User"}
          </span>
          <span className="text-xs text-gray-500">
            {user?.email}
          </span>
        </li>

        {/* Menu Items */}
        <li>
          <Link href="/add-product">Add Product</Link>
        </li>

        <li>
          <Link href="/manage-products">Manage Products</Link>
        </li>

        {/* Logout */}
        <li>
          <button
            onClick={() =>
              signOut({
                callbackUrl: "/",
              })
            }
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AuthButtons;