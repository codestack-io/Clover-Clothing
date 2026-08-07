"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  Home,
  LayoutDashboard,
  Search,
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";

const productLinks = [
  { label: "Soft Cotton", href: "/pc/premium?cottonType=Soft Cotton" },
  { label: "Light Cotton", href: "/pc/premium?cottonType=Light Cotton" },
  { label: "Silk Cotton", href: "/pc/premium?cottonType=Silk Cotton" },
  { label: "Handloom Cotton", href: "/pc/premium?cottonType=Handloom Cotton" },
  { label: "Best Sellers", href: "/products/best-sellers" },
  { label: "New Arrivals", href: "/products/new-arrivals" },
];

const pageLinks = [
  { label: "Compare", href: "/compare" },
  { label: "Reviews", href: "/review" },
  { label: "Orders", href: "/my-account/orders" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const Accordion = ({ title, links, onNavigate }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-black/[0.06]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-[15px] font-medium tracking-wide text-[#111]"
      >
        {title}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChevronDown size={16} strokeWidth={1.75} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 pb-3 pl-1">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={onNavigate}
                  className="rounded-lg px-2 py-2 text-[14px] text-[#111]/70 transition-colors hover:bg-black/[0.04] hover:text-[#111]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * MobileMenu
 * Full-height panel that slides in from the left over a blurred overlay.
 */
const MobileMenu = ({ open, onClose, isAdmin }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm lg:hidden"
          />

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 top-0 z-[70] flex h-full w-[86vw] max-w-[380px] flex-col bg-[#fafafa]/95 shadow-[0_0_60px_rgba(0,0,0,0.15)] backdrop-blur-2xl lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.06]">
              <span className="text-[15px] font-semibold tracking-[0.08em] text-[#111]">
                CLOVER
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/[0.05]"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-3 border-b border-black/[0.06] py-4 text-[15px] font-medium text-[#111]"
              >
                <Home size={16} strokeWidth={1.75} />
                Home
              </Link>

              {isAdmin && (
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="flex items-center gap-3 border-b border-black/[0.06] py-4 text-[15px] font-medium text-[#111]"
                >
                  <LayoutDashboard size={16} strokeWidth={1.75} />
                  Dashboard
                </Link>
              )}

              <Accordion title="Products" links={productLinks} onNavigate={onClose} />

              <Link
                href="/collections"
                onClick={onClose}
                className="flex items-center border-b border-black/[0.06] py-4 text-[15px] font-medium text-[#111]"
              >
                Collections
              </Link>

              <Link
                href="/about"
                onClick={onClose}
                className="flex items-center border-b border-black/[0.06] py-4 text-[15px] font-medium text-[#111]"
              >
                About
              </Link>

              <Accordion title="Pages" links={pageLinks} onNavigate={onClose} />
            </div>

            <div className="flex items-center justify-around border-t border-black/[0.06] px-6 py-5">
              <button className="flex flex-col items-center gap-1.5 text-[11px] text-[#111]/60">
                <Search size={18} strokeWidth={1.75} />
                Search
              </button>
              <Link
                href="/wishlist"
                onClick={onClose}
                className="flex flex-col items-center gap-1.5 text-[11px] text-[#111]/60"
              >
                <Heart size={18} strokeWidth={1.75} />
                Wishlist
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="flex flex-col items-center gap-1.5 text-[11px] text-[#111]/60"
              >
                <ShoppingBag size={18} strokeWidth={1.75} />
                Cart
              </Link>
              <Link
                href="/my-account"
                onClick={onClose}
                className="flex flex-col items-center gap-1.5 text-[11px] text-[#111]/60"
              >
                <User size={18} strokeWidth={1.75} />
                Account
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;