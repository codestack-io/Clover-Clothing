"use client";

import React, { useState } from "react";

const CheckOutFrom = ({ cartItems }) => {

  const [items, setItems] = useState(cartItems);

  // ✅ ADD THIS FUNCTION HERE
  const handleCheckout = async () => {
    const res = await fetch("/api/checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartItems: items,
      }),
    });

    const data = await res.json();

    console.log("RESPONSE:", data);

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  return (
    <div>

      {/* Example cart UI */}
      {items.map(item => (
        <div key={item._id}>
          <p>{item.name}</p>
          <p>${item.price}</p>
        </div>
      ))}

      {/* ✅ ADD BUTTON HERE */}
      <button
        onClick={handleCheckout}
        className="bg-green-600 text-white px-6 py-3 mt-6 rounded"
      >
        Pay Now
      </button>

    </div>
  );
};

export default CheckOutFrom;