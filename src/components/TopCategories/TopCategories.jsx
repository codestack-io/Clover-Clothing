"use client";

import React from "react";

const TopCategoriesSection = () => {
  return (
    <div className="w-full bg-gray-100 py-2">
      
      
      {/* Line + Title + Line */}
      <div className="flex items-center justify-center gap-6 px-6">
        <div className="h-[2px] bg-gray-700 w-full max-w-xs"></div>

        <h2 className="text-lg tracking-widest font-medium text-gray-800 whitespace-nowrap">
          TOP CATEGORIES
        </h2>

        <div className="h-[2px] bg-gray-700 w-full max-w-xs"></div>
      </div>

    </div>
  );
};

export default TopCategoriesSection;