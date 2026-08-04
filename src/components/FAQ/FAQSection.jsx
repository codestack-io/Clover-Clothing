"use client";

import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchX, MessageCircle } from "lucide-react";

import FAQSearch from "./FAQSearch";
import FAQCategories from "./FAQCategories";
import FAQAccordion from "./FAQAccordion";
import SupportCard from "./SupportCard";
import { faqs, categories } from "./faqData";
import { MESSENGER_URL } from "./faqConfig";

/**
 * FAQSection
 * Top-level, drop-in section for a Next.js page:
 *
 *   import FAQSection from "@/components/faq/FAQSection";
 *   export default function Page() { return <FAQSection />; }
 *
 * Owns the two pieces of state that drive filtering (search query +
 * active category) and derives the visible FAQ list with useMemo so the
 * (potentially expensive, string-matching) filter only re-runs when the
 * query or category actually changes — not on every unrelated re-render.
 */
export default function FAQSection() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategoryChange = useCallback((categoryId) => {
    setActiveCategory(categoryId);
  }, []);

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "all" || faq.category === activeCategory;

      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      // Search across question, answer, and keywords — case-insensitive.
      const haystack = [faq.question, faq.answer, ...faq.keywords]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [query, activeCategory]);

  const hasResults = filteredFaqs.length > 0;

  return (
    <section
      aria-labelledby="faq-heading"
      className="bg-neutral-50 px-4 py-20 dark:bg-neutral-950 sm:py-28"
    >
      <div className="mx-auto max-w-3xl">
        {/* Header ------------------------------------------------------ */}
        <div className="text-center">
          <motion.h2
            id="faq-heading"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400"
          >
            Find quick answers to common questions about orders, shipping,
            returns, sizing, and payments.
          </motion.p>
        </div>

        {/* Search -------------------------------------------------------- */}
        <div className="mt-8">
          <FAQSearch value={query} onChange={setQuery} />
        </div>

        {/* Category filters ---------------------------------------------- */}
        <div className="mt-5">
          <FAQCategories
            categories={categories}
            activeCategory={activeCategory}
            onChange={handleCategoryChange}
          />
        </div>

        {/* Results --------------------------------------------------------- */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {hasResults ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FAQAccordion faqs={filteredFaqs} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-14 text-center dark:border-neutral-800 dark:bg-neutral-900"
              >
                <SearchX
                  className="h-8 w-8 text-neutral-300 dark:text-neutral-700"
                  aria-hidden="true"
                />
                <p className="mt-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  No matching questions found.
                </p>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500">
                  Can&apos;t find what you&apos;re looking for?
                </p>
                <a
                  href={MESSENGER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-clover-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-clover-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clover-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Message us on Facebook
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Still need help ------------------------------------------------- */}
        <div className="mt-14">
          <SupportCard />
        </div>
      </div>
    </section>
  );
}