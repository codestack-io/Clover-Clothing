"use client";

import React, { useState } from "react";
import SizeSelector from "../components/SizeSelector/sizeSelector";
import CartButton from "./Buttons/CartButton";
import Swal from "sweetalert2";

const ProductActions = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(null);

  return (
    <div>
      <SizeSelector onSelect={setSelectedSize} />

      <button
        onClick={() => {
          if (!selectedSize) {
            Swal.fire("Please select a size first!");
            return;
          }

          const updatedProduct = {
            ...product,
            size: selectedSize,
          };

          console.log(updatedProduct);

          // you can pass to CartButton or custom logic
        }}
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductActions;