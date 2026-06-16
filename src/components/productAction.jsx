"use client";

import React, { useState } from "react";
import SizeSelector from "./SizeSelector/sizeSelector";
import CartButton from "./Buttons/CartButton";

const productActions = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(null);

  return (
    <div>
      { /* ✅ Size */ }
      <SizeSelector onSelect={setSelectedSize} />

      { /* ✅ CartButton */ }
      <CartButton
        product={{
          ...product,
          size: selectedSize, // ✅ size pass
        }}
      />
    </div>
  );
};

export default productActions;