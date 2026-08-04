"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * CategoryCard
 * -----------------------------------------------------------------------
 * Purely presentational. Reads whichever fields exist on `category` and
 * renders nothing it can't find real data for (no invented counts,
 * prices, etc.) — this keeps it safe to drop in regardless of your exact
 * API response shape.
 *
 * Expected-but-flexible fields on `category`:
 *   name / title      -> display name
 *   image / imageUrl  -> cover image
 *   slug / _id / id   -> used to build the link href
 *   productCount / count / itemCount -> shown as a glass badge if present
 */
function CategoryCard({ category, index = 0 }) {
  const displayName = category?.name || category?.title || "Category";
  const displayImage =
    category?.image || category?.imageUrl || "/placeholder-category.jpg";

  const itemCount =
    category?.productCount ?? category?.count ?? category?.itemCount ?? null;

  const slugOrId = category?.slug || category?._id || category?.id;
  // Adjust this href pattern to match your real category route if it
  // differs (e.g. `/shop?category=${slugOrId}`).
  const href = slugOrId ? `/category/${slugOrId}` : "#";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <Link
        href={href}
        aria-label={`Shop ${displayName}`}
        className="relative block aspect-[3/4] w-full overflow-hidden rounded-3xl bg-neutral-200 shadow-md ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
      >
        {/* Cover image, zooms slightly on hover */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayImage}
          alt={displayName}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Gradient overlay, darkens on hover */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300 group-hover:opacity-90"
        />

        {/* Glassmorphism item-count badge */}
        {itemCount !== null && (
          <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {itemCount} {Number(itemCount) === 1 ? "Item" : "Items"}
          </span>
        )}

        {/* Title + arrow */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
              {displayName}
            </h3>
            <span className="mt-1 block text-xs font-medium text-white/0 transition-all duration-300 group-hover:text-white/80">
              Shop now
            </span>
          </div>

          <span className="flex h-9 w-9 shrink-0 -translate-x-2 items-center justify-center rounded-full bg-white text-neutral-900 opacity-0 shadow-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default React.memo(CategoryCard);