import React from "react";

/**
 * CategorySkeleton
 * Matches the aspect ratio and rounded corners of CategoryCard so the
 * loading -> loaded transition doesn't cause layout shift.
 */
function CategorySkeleton() {
  return (
    <div className="relative aspect-[3/4] w-full animate-pulse overflow-hidden rounded-3xl bg-neutral-200">
      <div className="absolute inset-x-4 bottom-5 h-5 w-2/3 rounded-md bg-neutral-300" />
      <div className="absolute left-4 top-4 h-6 w-16 rounded-full bg-neutral-300/80" />
    </div>
  );
}

export default React.memo(CategorySkeleton);