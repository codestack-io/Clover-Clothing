"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * FAQItem
 * A single accordion row. Presentational only — open/close state and
 * the "only one open at a time" rule are owned by FAQAccordion.
 *
 * Accessibility:
 * - The trigger is a real <button> so it's reachable/activatable via
 *   keyboard (Tab + Enter/Space) without any extra key handling.
 * - aria-expanded reflects open state; aria-controls points at the
 *   answer panel's id so screen readers can associate the two.
 * - The answer panel uses role="region" + aria-labelledby back to the
 *   question button.
 */
function FAQItem({ faq, isOpen, onToggle, index }) {
  const buttonId = `faq-trigger-${faq.id}`;
  const panelId = `faq-panel-${faq.id}`;

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors duration-200 dark:bg-neutral-900 ${
        isOpen
          ? "border-clover-300 dark:border-clover-800"
          : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
      }`}
    >
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => onToggle(faq.id)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clover-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 sm:px-6 sm:py-5"
        >
          <span
            className={`text-[15px] font-medium leading-snug transition-colors duration-200 sm:text-base ${
              isOpen
                ? "text-clover-700 dark:text-clover-400"
                : "text-neutral-800 dark:text-neutral-100"
            }`}
          >
            {faq.question}
          </span>

          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
              isOpen
                ? "bg-clover-600 text-white"
                : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
            }`}
          >
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-neutral-600 dark:text-neutral-400 sm:px-6 sm:pb-6">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// index isn't used in rendering logic today but is kept in props so
// future features (e.g. staggered entrance animation) don't require a
// signature change.
export default memo(FAQItem);