"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCompare,
  Star,
  Package,
  HelpCircle,
  Mail,
} from "lucide-react";

const items = [
  { label: "Compare", href: "/compare", icon: GitCompare },
  { label: "Reviews", href: "/review", icon: Star },
  { label: "Orders", href: "/my-account/orders", icon: Package },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
  { label: "Contact", href: "/contact", icon: Mail },
];

const cardVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    transition: { duration: 0.16, ease: "easeIn" },
  },
};

/**
 * PagesDropdown
 * Small floating glass card triggered from the "Pages" nav item.
 */
const PagesDropdown = ({ open }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute left-1/2 top-full mt-4 w-56 -translate-x-1/2 rounded-2xl border border-white/25 bg-white/80 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.12)] backdrop-blur-2xl"
        >
          {items.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] text-[#111] transition-colors duration-200 hover:bg-black/[0.045]"
            >
              <Icon
                size={15}
                strokeWidth={1.75}
                className="text-[#111]/45 transition-colors duration-200 group-hover:text-[#16a34a]"
              />
              {label}
            </Link>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PagesDropdown;