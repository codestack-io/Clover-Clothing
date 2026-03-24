"use client";
import React, { useState } from "react";

const SizeSelector = ({ onSelect }) => {
  const sizes = ["M", "L", "XL", "XXL"];
  const [selected, setSelected] = useState(null);

  const handleSelect = (size) => {
    setSelected(size);
    onSelect(size);
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Select Size</h2>

      <div className="flex gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => handleSelect(size)}
            className={`px-4 py-2 border rounded-lg font-medium transition 
              ${
                selected === size
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
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