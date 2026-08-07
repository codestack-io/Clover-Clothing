"use client";

import Link from "next/link";
import { Globe, HelpCircle, User } from "lucide-react";

const TopBar = () => {
  return (
    <div className="border-b border-neutral-200/70 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-11 max-w-7xl items-center justify-between px-6">

        {/* Left */}
        <div className="flex items-center gap-4 text-sm text-neutral-600">

          {/* Bangladesh Flag */}
          <div className="flex items-center gap-2">
            <div className="relative h-4 w-4 rounded-full bg-green-600">
              <div className="absolute left-1 top-1 h-2 w-2 rounded-full bg-red-600"></div>
            </div>

            <span className="font-medium">Bangladesh</span>
          </div>

          <div className="h-4 w-px bg-neutral-300" />

          <button className="transition hover:text-black">
            EN
          </button>

          <div className="h-4 w-px bg-neutral-300" />

          <button className="transition hover:text-black">
            BDT
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6 text-sm">

          <Link
            href="/faq"
            className="flex items-center gap-2 text-neutral-600 transition hover:text-black"
          >
            <HelpCircle size={16} />
            FAQ
          </Link>

          <Link
            href="/my-account"
            className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-2 font-medium text-neutral-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
          >
            <User size={16} />
            My Account
          </Link>

        </div>

      </div>
    </div>
  );
};

export default TopBar;