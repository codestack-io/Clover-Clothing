"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart, ShoppingBag, Menu, ChevronDown } from "lucide-react";

import Logo from "../Logo/Logo";
import MegaMenu from "../MegaMenu";
import PagesDropdown from "../PagesDropdown";
import MobileMenu from "../MobileMenu";

import ProfileMenu from "../ProfileMenu";
import useCartStore from "@/store/cartStore";
// Replace with real cart state (context / redux / query) when wiring this up.


/**
 * NavItem
 * Shared link styling for top-level nav entries: underline-on-hover,
 * no default blue focus rings, letter-spaced small caps feel.
 */
const NavItem = ({ href, children, className = "" }) => (
  <Link
    href={href}
    className={`group relative text-[13.5px] font-medium tracking-[0.01em] text-[#111] transition-colors duration-300 hover:text-black ${className}`}
  >
    {children}
    <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#111] transition-all duration-300 ease-out group-hover:w-full" />
  </Link>
);

const Navbar = () => {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);

  const productsTimer = useRef(null);
  const pagesTimer = useRef(null);
  const cart = useCartStore((state) => state.cart);

  const cartCount = cart.reduce(
  (total, item) => total + item.quantity,
  0
);

  // Small delay on leave prevents flicker when moving the cursor
  // from the trigger toward the panel.
  const openProducts = useCallback(() => {
    clearTimeout(productsTimer.current);
    setProductsOpen(true);
  }, []);
  const closeProducts = useCallback(() => {
    productsTimer.current = setTimeout(() => setProductsOpen(false), 120);
  }, []);

  const openPages = useCallback(() => {
    clearTimeout(pagesTimer.current);
    setPagesOpen(true);
  }, []);
  const closePages = useCallback(() => {
    pagesTimer.current = setTimeout(() => setPagesOpen(false), 120);
  }, []);

  const isAdmin = session?.user?.role === "admin";

  return (
    <>
      <header className="sticky top-0 z-50 h-[72px] w-full border-b border-white/25 bg-white/65 shadow-[0_1px_24px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-10">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#111] transition-colors hover:bg-black/[0.04] lg:hidden"
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>
            <Logo />
          </div>

          {/* Center: Nav links (desktop) */}
          <nav className="hidden items-center gap-10 lg:flex">
            <NavItem href="/">Home</NavItem>

            {isAdmin && <NavItem href="/dashboard">Dashboard</NavItem>}

            {/* Products — mega menu */}
            <div
              className="relative"
              onMouseEnter={openProducts}
              onMouseLeave={closeProducts}
            >
              <button
                type="button"
                className="group flex items-center gap-1 text-[13.5px] font-medium tracking-[0.01em] text-[#111] transition-colors duration-300 hover:text-black"
              >
                <span className="relative">
                  Products
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-[#111] transition-all duration-300 ease-out ${
                      productsOpen ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </span>
                <ChevronDown
                  size={13}
                  strokeWidth={2}
                  className={`transition-transform duration-300 ${
                    productsOpen ? "-rotate-180" : ""
                  }`}
                />
              </button>
              <MegaMenu open={productsOpen} />
            </div>

           
            <NavItem href="/about">About</NavItem>

            {/* Pages — floating dropdown */}
            <div
              className="relative"
              onMouseEnter={openPages}
              onMouseLeave={closePages}
            >
              <button
                type="button"
                className="group flex items-center gap-1 text-[13.5px] font-medium tracking-[0.01em] text-[#111] transition-colors duration-300 hover:text-black"
              >
                <span className="relative">
                  Pages
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-[#111] transition-all duration-300 ease-out ${
                      pagesOpen ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </span>
                <ChevronDown
                  size={13}
                  strokeWidth={2}
                  className={`transition-transform duration-300 ${
                    pagesOpen ? "-rotate-180" : ""
                  }`}
                />
              </button>
              <PagesDropdown open={pagesOpen} />
            </div>
          </nav>

          {/* Right: Icons + Auth */}
          <div className="flex items-center gap-1.5">
            

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-[#111] transition-colors duration-300 hover:bg-black/[0.04] sm:flex"
            >
              <Heart size={18} strokeWidth={1.75} />
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#111] transition-colors duration-300 hover:bg-black/[0.04]"
            >
              <ShoppingBag size={18} strokeWidth={1.75} />
             {cartCount > 0 && (
  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#16a34a] px-1 text-[10px] font-semibold leading-none text-white">
    {cartCount}
  </span>
)}
            </Link>

            <div className="ml-1">
              <ProfileMenu />
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isAdmin={isAdmin}
      />
    </>
  );
};

export default Navbar;