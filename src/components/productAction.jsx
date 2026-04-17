"use client";

import React, { useState } from "react";
import SizeSelector from "./SizeSelector/sizeSelector";
import CartButton from "./Buttons/CartButton";

const Productactions = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(null);

  return (
    <div>
      {/* ✅ Size নির্বাচন */}
      <SizeSelector onSelect={setSelectedSize} />

      {/* ✅ CartButton এখানে থাকবে */}
      <CartButton
        product={{
          ...product,
          size: selectedSize, // ✅ size pass হচ্ছে
        }}
      />
    </div>
  );
};

export default Productactions;