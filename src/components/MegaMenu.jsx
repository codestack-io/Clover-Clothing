"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const columns = [
  {
    title: "100% Cotton",
    links: [
      { label: "Basic Cotton Tee", href: "/products/cotton" },
      { label: "Cotton Hoodie", href: "/products/cotton" },
    ],
  },
  {
    title: "Organic Cotton",
    links: [
      { label: "Eco T-Shirt", href: "/products/organic" },
      { label: "Organic Hoodie", href: "/products/organic" },
    ],
  },
  {
    title: "Premium Cotton",
    links: [
      { label: "Soft Cotton", href: "/pc/premium?cottonType=Soft Cotton" },
      { label: "Light Cotton", href: "/pc/premium?cottonType=Light Cotton" },
      { label: "Silk Cotton", href: "/pc/premium?cottonType=Silk Cotton" },
      { label: "Handloom Cotton", href: "/pc/premium?cottonType=Handloom Cotton" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Best Sellers", href: "/products/best-sellers" },
      { label: "New Arrivals", href: "/products/new-arrivals" },
      { label: "Featured Collection", href: "/products/featured" },
    ],
  },
];

const panelVariants = {
  hidden: { opacity: 0, y: -10, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

/**
 * MegaMenu
 * Floating panel triggered from the "Products" nav item.
 * Left: editorial image. Right: category columns.
 */
const MegaMenu = ({ open }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute left-1/2 top-full mt-4 w-[92vw] max-w-[820px] -translate-x-1/2 rounded-[24px] border border-white/25 bg-white/80 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.14)] backdrop-blur-2xl"
        >
          <div className="grid grid-cols-[1fr_1.4fr] gap-3 overflow-hidden rounded-[18px]">
            {/* Image preview */}
            <Link
              href="/products/featured"
              className="group relative block h-[340px] overflow-hidden rounded-[16px] bg-[#111]"
            >
              <Image
                src="/images/mega-menu-preview.jpg"
                alt="Clover Clothing featured collection"
                fill
                sizes="360px"
                className="object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">
                  Autumn Edit
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-[17px] font-medium text-white">
                  Shop the Collection
                  <ArrowUpRight
                    size={16}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </p>
              </div>
            </Link>

            {/* Category columns */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-8 p-6">
              {columns.map((column) => (
                <div key={column.title}>
                  <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#111]/45">
                    {column.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="group inline-block text-[14px] text-[#111] transition-colors duration-200 hover:text-[#16a34a]"
                        >
                          <span className="relative">
                            {link.label}
                            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#16a34a] transition-all duration-300 group-hover:w-full" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MegaMenu;