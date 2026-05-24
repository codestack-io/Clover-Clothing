"use client";
import React, { useState, useRef, useEffect } from "react";
import NavLink from "../Buttons/NavLink";
import Logo from "../Logo/Logo";
import Link from "next/link";
import { IoMdCart } from "react-icons/io";
import AuthButtons from "../Buttons/AuthButtons";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { RiPageSeparator } from "react-icons/ri";

const Navbar = () => {
  const [showPages, setShowPages] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pagesRef = useRef(null);
  const [showProducts, setShowProducts] = useState(false);
  const productsRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pagesRef.current && !pagesRef.current.contains(event.target)) {
        setShowPages(false);
      }
      if (productsRef.current && !productsRef.current.contains(event.target)) {
        setShowProducts(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = (
    <>
      <li className="text-gray-700 font-sans text-lg">
        <NavLink href={"/"}>
          <FaHome /> Home
        </NavLink>
      </li>

      {/* Products Mega Menu */}
      <li
        className="relative text-gray-700 font-sans text-lg"
        ref={productsRef}
        onMouseEnter={() => setShowProducts(true)}
        onMouseLeave={() => setShowProducts(false)}
      >
        <button className="flex items-center gap-1 font-medium hover:text-black transition">
          <MdOutlineProductionQuantityLimits /> Products
        </button>

        <div
  className={`absolute left-0 top-full mt-3 w-[95vw] max-w-[700px] bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 z-50 transition-all duration-200 ${
    showProducts
      ? "opacity-100 visible translate-y-0"
      : "opacity-0 invisible -translate-y-2"
  }`}
>
          <div className="grid grid-cols-3 gap-6">

            {/* Category 1 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">100% Cotton</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/products/cotton">Basic Cotton Tee</Link>
                </li>
                <li>
                  <Link href="/products/cotton">Cotton Hoodie</Link>
                </li>
              </ul>
            </div>

            {/* Category 2 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Organic Cotton</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/products/organic">Eco T-Shirt</Link>
                </li>
                <li>
                  <Link href="/products/organic">Organic Hoodie</Link>
                </li>
              </ul>
            </div>

            {/* Category 3 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Premium Cotton</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/pc/premium?cottonType=Soft Cotton">Soft Cotton</Link>
                </li>
                <li>
                  <Link href="/pc/premium?cottonType=Light Cotton">Light Cotton</Link>
                </li>
                <li>
                  <Link href="/pc/premium?cottonType=Silk Cotton">Silk Cotton</Link>
                </li>
                <li>
                  <Link href="/pc/premium?cottonType=Handloom Cotton">Handloom Cotton</Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </li>

      {/* Pages Dropdown */}
      <li
        className="relative text-gray-700 font-sans text-lg"
        ref={pagesRef}
        onMouseEnter={() => setShowPages(true)}
        onMouseLeave={() => setShowPages(false)}
      >
        <button className="flex items-center gap-1 font-medium hover:text-black transition">
          <RiPageSeparator /> Pages
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <ul
          className={`absolute top-full left-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 transition-all duration-200 ${
            showPages ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
          }`}
        >
          <li>
            <Link href="/compare" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition rounded-lg">
              Compare
            </Link>
          </li>
          <li>
            <Link href="/my-account/orders" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition rounded-lg">
              My Orders
            </Link>
          </li>
          <li>
            <Link href="/review" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition rounded-lg">
              Review
            </Link>
          </li>
        </ul>
      </li>
    </>
  );

  return (
    <div className="navbar justify-between bg-gray-200 shadow-sm px-4">
      {/* Mobile Menu */}
      <div className="navbar-start flex items-center justify-between w-full lg:w-auto">
        <Logo />

        {/* Hamburger Button */}
        <button
          className="lg:hidden btn btn-ghost"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>

      {/* Right Side Icons */}
      <div className="navbar-end space-x-4 hidden lg:flex">
        <Link href={"/cart"} className="btn btn-ghost">
          <IoMdCart />
        </Link>
        <AuthButtons />
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-gray-200 shadow-md z-50">
          <ul className="flex flex-col p-4 gap-2">{navLinks}</ul>
          <div className="flex items-center gap-4 px-4 mt-2">
            <Link href={"/cart"} className="btn btn-ghost">
              <IoMdCart />
            </Link>
            <AuthButtons />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;