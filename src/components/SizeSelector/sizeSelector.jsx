"use client";

import React, { useState } from "react";

const sizes = ["S", "M", "L", "XL", "XXL"];

const SizeSelector = ({ onSelect }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (size) => {
    setSelected(size);
    onSelect(size); // send to parent
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Select Size</h2>

      <div className="flex gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => handleSelect(size)}
            className={`px-4 py-2 rounded-lg border font-semibold transition ${
              selected === size
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;