"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Package, Settings } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

/**
 * ProfileMenu
 * Replaces the old AuthButtons block with a single account glyph.
 * Signed out -> click opens sign in. Signed in -> floating account card.
 */
const ProfileMenu = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session) {
    return (
      <button
        type="button"
        onClick={() => signIn()}
        className="flex h-9 w-9 items-center justify-center rounded-full text-[#111] transition-colors duration-300 hover:bg-black/[0.04]"
        aria-label="Sign in"
      >
        <User size={18} strokeWidth={1.75} />
      </button>
    );
  }

  const initials =
    session.user?.name?.trim()?.charAt(0)?.toUpperCase() ||
    session.user?.email?.charAt(0)?.toUpperCase() ||
    "A";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#111]/10 bg-black/[0.03] text-[11px] font-semibold tracking-wide text-[#111] transition-all duration-300 hover:border-[#111]/25 hover:bg-black/[0.06]"
      >
        {initials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-3 w-60 origin-top-right rounded-2xl border border-white/25 bg-white/80 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl"
          >
            <div className="px-3 pb-2 pt-2">
              <p className="truncate text-[13px] font-semibold text-[#111]">
                {session.user?.name || "Your account"}
              </p>
              <p className="truncate text-[12px] text-[#111]/50">
                {session.user?.email}
              </p>
            </div>

            <div className="my-1 h-px bg-black/[0.06]" />

            {session.user?.role === "admin" && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-[#111] transition-colors hover:bg-black/[0.04]"
              >
                <Settings size={15} strokeWidth={1.75} />
                Dashboard
              </Link>
            )}

            <Link
              href="/my-account/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-[#111] transition-colors hover:bg-black/[0.04]"
            >
              <Package size={15} strokeWidth={1.75} />
              My Orders
            </Link>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] text-[#111] transition-colors hover:bg-black/[0.04]"
            >
              <LogOut size={15} strokeWidth={1.75} />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;