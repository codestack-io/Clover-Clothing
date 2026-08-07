"use client";

import React, { useState } from "react";
import { Ruler } from "lucide-react";

const sizes = ["S", "M", "L", "XL", "XXL"];

const SizeSelector = ({ onSelect }) => {
  const [selected, setSelected] = useState("");

  const handleSelect = (size) => {
    setSelected(size);
    onSelect?.(size);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">
            Select Size
          </h3>

          <p className="text-sm text-neutral-500 mt-1">
            Choose the size that fits you best.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 text-sm text-neutral-600 hover:text-black transition"
        >
          <Ruler size={16} />
          Size Guide
        </button>
      </div>

      {/* Size Buttons */}
      <div className="grid grid-cols-5 gap-3">
        {sizes.map((size) => {
          const active = selected === size;

          return (
            <button
              key={size}
              type="button"
              onClick={() => handleSelect(size)}
              className={`rounded-xl border py-3 font-semibold transition-all duration-200
                ${
                  active
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-lg scale-[1.03]"
                    : "bg-white border-neutral-300 text-neutral-700 hover:border-black hover:bg-neutral-50"
                }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* Selected Size */}
      <div className="rounded-xl bg-neutral-100 px-4 py-3 text-sm">
        {selected ? (
          <>
            Selected Size:{" "}
            <span className="font-semibold text-black">{selected}</span>
          </>
        ) : (
          <span className="text-neutral-500">
            Please select a size before adding to cart.
          </span>
        )}
      </div>
    </div>
  );
};

export default SizeSelector;