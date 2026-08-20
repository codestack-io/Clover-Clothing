"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import {
  Grid2x2,
  Package,
  Truck,
  RotateCcw,
  CreditCard,
  Shirt,
  UserRound,
} from "lucide-react";

// Maps the plain string keys stored in faqData.js to actual icon components.
// Keeping this lookup here (rather than in faqData.js) keeps the data file
// framework-agnostic.
const ICON_MAP = {
  Grid2x2,
  Package,
  Truck,
  RotateCcw,
  CreditCard,
  Shirt,
  UserRound,
};

/**
 * FAQCategories
 * Horizontal, scrollable row of filter pills. Fully keyboard accessible
 * (native <button> elements, visible focus ring) and announces the active
 * filter to assistive tech via aria-pressed.
 */
function FAQCategories({ categories, activeCategory, onChange }) {
  return (
    <div
      role="group"
      aria-label="Filter questions by category"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
    >
      {categories.map((category) => {
        const Icon = ICON_MAP[category.icon] ?? Grid2x2;
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(category.id)}
            className={`relative flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clover-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950 ${
              isActive
                ? "border-clover-600 text-black"
                : "border-neutral-200 text-neutral-600 hover:border-clover-300 hover:text-clover-700 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-clover-700 dark:hover:text-clover-400"
            }`}
          >
            {/* Active pill background, animated between selections */}
            {isActive && (
              <motion.span
                layoutId="active-category-pill"
                className="absolute inset-0 rounded-full bg-clover-600"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <Icon className="relative z-10 h-3.5 w-3.5" aria-hidden="true" />
            <span className="relative z-10">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default memo(FAQCategories);