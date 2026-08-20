"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Mail } from "lucide-react";
import { MESSENGER_URL, SUPPORT_EMAIL_URL } from "./faqConfig";

/**
 * SupportCard
 * "Still need help?" panel shown at the bottom of the FAQ section.
 *
 * "Chat with us" intentionally does NOT open an in-house chatbot — it
 * opens Facebook Business Messenger in a new tab, per product decision.
 * Swap MESSENGER_URL in faqConfig.js once the real page username exists.
 */
function SupportCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl border border-clover-100 bg-gradient-to-br from-clover-50 via-white to-white p-8 text-center shadow-sm dark:border-clover-900/60 dark:from-clover-950/40 dark:via-neutral-900 dark:to-neutral-900 sm:p-10"
    >
      {/* Soft decorative glow — purely visual, hidden from assistive tech */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-clover-200/40 blur-3xl dark:bg-clover-800/20"
      />

      <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 sm:text-2xl">
        Still need help?
      </h3>
      <p className="mx-auto mt-2 max-w-md text-[15px] text-neutral-600 dark:text-neutral-400">
        Our support team is always ready to help you.
      </p>

      <div className="relative mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={MESSENGER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-clover-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-clover-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clover-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 sm:w-auto"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Chat with us
        </a>

       <a
        href={SUPPORT_EMAIL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-clover-200 bg-white px-6 py-3 text-sm font-medium text-neutral-800 shadow-sm transition-all duration-200 hover:border-clover-300 hover:bg-clover-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clover-500 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 sm:w-auto"
        >
  <Mail className="h-4 w-4" aria-hidden="true" />
  Email Us
</a>
      </div>
    </motion.div>
  );
}

export default memo(SupportCard);