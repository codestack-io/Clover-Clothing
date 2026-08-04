import React from "react";

/**
 * ProductSkeleton
 * Mirrors the grid ProductCard's proportions (image + info block) so the
 * loading state doesn't jump when real products arrive.
 */
function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="aspect-[4/5] w-full animate-pulse bg-neutral-200" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-1/4 animate-pulse rounded bg-neutral-200" />
        <div className="mt-1 h-8 w-2/5 animate-pulse rounded-full bg-neutral-200" />
      </div>
    </div>
  );
}

export default React.memo(ProductSkeleton);