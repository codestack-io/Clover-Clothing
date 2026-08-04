"use client";

import { memo } from "react";
import { Search, X } from "lucide-react";

/**
 * FAQSearch
 * Controlled search input. Deliberately dumb/reusable — it knows nothing
 * about FAQ data or matching logic, it just reports the raw query up to
 * the parent via onChange. That keeps it reusable for any future search
 * surface (e.g. an AI assistant prompt box).
 */
function FAQSearch({ value, onChange, placeholder = "Search your question..." }) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
        aria-hidden="true"
      />
      <input
        type="text"
        role="searchbox"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search frequently asked questions"
        className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-11 pr-11 text-[15px] text-neutral-900 shadow-sm transition-shadow duration-200 placeholder:text-neutral-400 focus:border-clover-500 focus:shadow-md focus:outline-none focus:ring-4 focus:ring-clover-500/10 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-clover-500/20"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clover-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default memo(FAQSearch);