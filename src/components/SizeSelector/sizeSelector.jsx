"use client";
import React, { useState } from "react";

const SizeSelector = ({ onSelect }) => {
  const sizes = ["M", "L", "XL", "XXL"];
  const [selected, setSelected] = useState(null);

  const handleClick = (size) => {
    setSelected(size);
    onSelect(size); // ✅ SAFE (client → client)
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Select Size</h2>
      <div className="flex gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => handleClick(size)}
            className={`px-4 py-2 border rounded-lg ${
              selected === size
                ? "bg-black text-white"
                : "bg-white"
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