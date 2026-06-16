"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const CheckoutForm = ({ cartItems }) => {
  const { data: session } = useSession();
  const router = useRouter();

  // Form fields for shipping/payment
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cash",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!session) return <h2>Loading...</h2>;
  if (!cartItems || !cartItems.length)
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
      </div>
    );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

 const handlePlaceOrder = async () => {
  try {
    if (!session?.user) {
      Swal.fire("Error", "User not logged in");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      Swal.fire("Error", "Cart is empty!");
      return;
    }

    console.log("Cart Items:", cartItems); // ✅ DEBUG

    // 1️⃣ Create Order
    const res = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cartItems,
        totalPrice,
        ...formData,
        user: {
          email: session.user.email,
          name: session.user.name,
        },
      }),
    });

    const data = await res.json();
    console.log("Order response:", data); // ✅ DEBUG

    if (!data.success) {
      Swal.fire("Error", data.error || "Failed to create order");
      return;
    }

    const orderId = data.orderId;

    // 2️⃣ Stripe Payment
    if (formData.paymentMethod === "stripe") {
      const stripeRes = await fetch("/api/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems, // ✅ send full cartItems (NO mapping needed)
          orderId,
        }),
      });

      const stripeData = await stripeRes.json();
      console.log("Stripe response:", stripeData);

      if (stripeData.url) {
        window.location.href = stripeData.url;
        return;
      } else {
        Swal.fire("Error", stripeData.error || "Stripe checkout failed");
        return;
      }
    }

    // 3️⃣ Other Payments
    if (formData.paymentMethod === "bkash") {
      router.push("/payment/bkash");
    } else if (formData.paymentMethod === "nagad") {
      router.push("/payment/nagad");
    } else {
      router.push(`/success?orderId=${orderId}&method=cash`);
    }
  } catch (error) {
    console.error("Checkout Error:", error);
    Swal.fire("Error", "Something went wrong");
  }
};

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-8">
      {/* FORM */}
      <form className="md:col-span-2 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">Checkout</h2>

        <input
          type="text"
          value={session.user.name || ""}
          readOnly
          className="border p-3 rounded w-full mb-2"
        />
        <input
          type="email"
          value={session.user.email || ""}
          readOnly
          className="border p-3 rounded w-full mb-4"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="border p-3 rounded w-full mb-4"
        />
        <textarea
          name="address"
          placeholder="Shipping Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="border p-3 rounded w-full mb-4"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="border p-3 rounded w-full"
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
            className="border p-3 rounded w-full"
          />
        </div>

        {/* Payment Method */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Payment Method</h3>
          {["bkash", "nagad", "stripe", "cash"].map((method) => (
            <label key={method} className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={formData.paymentMethod === method}
                onChange={handleChange}
              />
              {method === "cash"
                ? "Cash on Delivery"
                : method.charAt(0).toUpperCase() + method.slice(1)}
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={handlePlaceOrder}
          className="mt-6 w-full bg-black text-white py-3 rounded hover:bg-gray-800"
        >
          Place Order
        </button>
      </form>

      {/* SUMMARY */}
      <div className="bg-white p-6 rounded-lg shadow h-fit">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between border-b py-2 text-sm">
            <span>
              {item.title} x {item.quantity}
            </span>
            <span>৳ {item.price * item.quantity}</span>
          </div>
        ))}

        <div className="flex justify-between font-semibold mt-4">
          <span>Total</span>
          <span>৳ {totalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;