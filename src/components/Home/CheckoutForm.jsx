"use client";
import OTPVerification from "../../app/checkout/OTPVerification";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  Phone,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  Banknote,
  Smartphone,
} from "lucide-react";

const CheckoutForm = ({ cartItems = [] }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cash",
  });

  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState("checkout");
const [verifiedPhone, setVerifiedPhone] = useState("");

const handlePhoneVerified = (phone) => {
  setVerifiedPhone(phone);

  setFormData((prev) => ({
    ...prev,
    phone,
  }));

  setVerificationStep("checkout");
};

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     EMPTY CART
  ========================= */

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <Truck size={28} className="text-neutral-500" />
          </div>

          <h2 className="text-2xl font-semibold text-neutral-900">
            Your cart is empty
          </h2>

          <p className="mt-2 text-neutral-500">
            Add some products before proceeding to checkout.
          </p>

          <button
            onClick={() => router.push("/products")}
            className="mt-6 rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-neutral-800"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     TOTALS
  ========================= */

  const totalItems = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const deliveryCharge = 0;

  const totalPrice = subtotal + deliveryCharge;

  /* =========================
     VALIDATION
  ========================= */

  const validateForm = () => {
    if (!formData.phone.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Phone number required",
        text: "Please enter your phone number.",
      });

      return false;
    }

    if (!formData.address.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Address required",
        text: "Please enter your delivery address.",
      });

      return false;
    }

    if (!formData.city.trim()) {
      Swal.fire({
        icon: "warning",
        title: "City required",
        text: "Please enter your city.",
      });

      return false;
    }

    return true;
  };

  /* =========================
     PLACE ORDER
  ========================= */
/* =========================
   SEND OTP
========================= */

const handlePlaceOrder = async () => {
  // If already verified, don't send OTP again
  if (verifiedPhone) {
    handleFinalOrder();
    return;
  }

  if (!formData.phone.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Phone number required",
      text: "Please enter your phone number.",
    });
    return;
  }

  try {
    setLoading(true);

    const response = await fetch("/api/auth/sendOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: formData.phone,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      Swal.fire({
        icon: "error",
        title: "Unable to send OTP",
        text: data.message || "Could not send OTP.",
      });

      return;
    }

    setVerificationStep("otp");

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "OTP sent",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: "Could not send OTP.",
    });
  } finally {
    setLoading(false);
  }
};


/* =========================
   FINAL ORDER
========================= */

const handleFinalOrder = async () => {
  if (!verifiedPhone) {
    Swal.fire({
      icon: "warning",
      title: "Phone verification required",
      text: "Please verify your phone number first.",
    });

    return;
  }

  if (!formData.address.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Address required",
      text: "Please enter your delivery address.",
    });

    return;
  }

  if (!formData.city.trim()) {
    Swal.fire({
      icon: "warning",
      title: "City required",
      text: "Please enter your city.",
    });

    return;
  }

  try {
    setLoading(true);

    // =================================
    // 1. CREATE PENDING ORDER
    // =================================

    const response = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cartItems,
        totalPrice,
        phone: verifiedPhone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        paymentMethod: formData.paymentMethod,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      Swal.fire({
        icon: "error",
        title: "Order creation failed",
        text: data.error || "Could not create your order.",
      });

      return;
    }

    const orderId = data.orderId;

    console.log("Order created:", orderId);

    // =================================
    // 2. STRIPE
    // =================================

    if (formData.paymentMethod === "stripe") {
      const stripeResponse = await fetch("/api/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          orderId,
        }),
      });

      const stripeData = await stripeResponse.json();

      if (!stripeResponse.ok || !stripeData.url) {
        Swal.fire({
          icon: "error",
          title: "Payment failed",
          text:
            stripeData.error ||
            "Could not start Stripe checkout.",
        });

        return;
      }

      window.location.href = stripeData.url;
      return;
    }

    // =================================
    // 3. CASH ON DELIVERY
    // =================================

    if (formData.paymentMethod === "cash") {
      router.push(
        `/success?orderId=${orderId}&method=cash`
      );

      return;
    }

    // =================================
    // 4. BKASH
    // =================================

    if (formData.paymentMethod === "bkash") {
      router.push(
        `/payment/bkash?orderId=${orderId}`
      );

      return;
    }

    // =================================
    // 5. NAGAD
    // =================================

    if (formData.paymentMethod === "nagad") {
      router.push(
        `/payment/nagad?orderId=${orderId}`
      );

      return;
    }
  } catch (error) {
    console.error("FINAL ORDER ERROR:", error);

    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: "Unable to place your order.",
    });
  } finally {
    setLoading(false);
  }
};


  if (verificationStep === "otp") {
    return (
      <OTPVerification
        phone={formData.phone}
        onBack={() => setVerificationStep("checkout")}
        onVerified={handlePhoneVerified}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
            Clover Clothing
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Complete your information to place your order.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">

          {/* =====================================================
              LEFT
          ====================================================== */}

          <div className="space-y-6">

          {/* CONTACT */}

<section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">

  <div className="mb-6 flex items-center gap-4">

    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100">
      <Phone size={20} />
    </div>

    <div>
      <h2 className="text-lg font-semibold">
        Contact information
      </h2>

      <p className="text-sm text-neutral-500">
        We'll use this number for order updates.
      </p>
    </div>

  </div>

  <label className="mb-2 block text-sm font-medium text-neutral-700">
    Phone number
  </label>

  <div className="relative">

    <Phone
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
    />

    <input
      type="tel"
      name="phone"
      placeholder="01XXXXXXXXX"
      value={formData.phone}
      onChange={handleChange}
      disabled={!!verifiedPhone}
      className={`w-full rounded-xl border py-3.5 pl-12 pr-4 outline-none transition
        ${
          verifiedPhone
            ? "border-green-200 bg-green-50 text-green-800"
            : "border-neutral-200 bg-neutral-50 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
        }
      `}
    />

  </div>

  {verifiedPhone ? (
    <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
      <ShieldCheck size={16} />
      Phone number verified
    </div>
  ) : (
    <p className="mt-2 text-xs text-neutral-400">
      Example: 01712345678
    </p>
  )}

</section>

            {/* SHIPPING */}

            <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-6 flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100">
                  <MapPin size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Delivery address
                  </h2>

                  <p className="text-sm text-neutral-500">
                    Where should we deliver your order?
                  </p>
                </div>

              </div>


              {/* ADDRESS */}

              <div className="mb-5">

                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Full address
                </label>

                <textarea
                  name="address"
                  rows={4}
                  placeholder="House / Road / Area"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
                />

              </div>


              {/* CITY + POSTAL */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    placeholder="Dhaka"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Postal code
                  </label>

                  <input
                    type="text"
                    name="postalCode"
                    placeholder="1200"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
                  />

                </div>

              </div>

            </section>


            {/* PAYMENT */}

            <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-6 flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100">
                  <CreditCard size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Payment method
                  </h2>

                  <p className="text-sm text-neutral-500">
                    Choose how you'd like to pay.
                  </p>
                </div>

              </div>


              <div className="grid gap-3 sm:grid-cols-2">

                {/* COD */}

                <label
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    formData.paymentMethod === "cash"
                      ? "border-black bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === "cash"}
                    onChange={handleChange}
                    className="sr-only"
                  />

                  <div className="flex items-center gap-3">

                    <Banknote size={22} />

                    <div>
                      <p className="font-medium text-black">
                        Cash on Delivery
                      </p>

                      <p className="text-xs text-neutral-500">
                        Pay when your order arrives
                      </p>
                    </div>

                  </div>

                </label>


                {/* BKASH */}

                <label
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    formData.paymentMethod === "bkash"
                      ? "border-black bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bkash"
                    checked={formData.paymentMethod === "bkash"}
                    onChange={handleChange}
                    className="sr-only "
                  />

                  <div className="flex items-center gap-3">

                    <Smartphone size={22} />

                    <div>
                      <p className="font-medium text-black">
                        bKash
                      </p>

                      <p className="text-xs text-neutral-500">
                        Pay securely with bKash
                      </p>
                    </div>

                  </div>

                </label>


                {/* NAGAD */}

                <label
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    formData.paymentMethod === "nagad"
                      ? "border-black bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="nagad"
                    checked={formData.paymentMethod === "nagad"}
                    onChange={handleChange}
                    className="sr-only"
                  />

                  <div className="flex items-center gap-3">

                    <Smartphone size={22} />

                    <div>
                      <p className="font-medium text-black">
                        Nagad
                      </p>

                      <p className="text-xs text-neutral-500">
                        Pay securely with Nagad
                      </p>
                    </div>

                  </div>

                </label>


                {/* STRIPE */}

                <label
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    formData.paymentMethod === "stripe"
                      ? "border-black bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={formData.paymentMethod === "stripe"}
                    onChange={handleChange}
                    className="sr-only"
                  />

                  <div className="flex items-center gap-3">

                    <CreditCard size={22} />

                    <div>
                      <p className="font-medium text-black">
                        Card
                      </p>

                      <p className="text-xs text-neutral-500">
                        Secure card payment
                      </p>
                    </div>

                  </div>

                </label>

              </div>

            </section>

          </div>


          {/* =====================================================
              RIGHT — ORDER SUMMARY
          ====================================================== */}

          <aside className="h-fit lg:sticky lg:top-24">

            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7">

              <div className="flex items-center justify-between">

                <h2 className="text-xl font-semibold">
                  Your order
                </h2>

                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                  {totalItems} items
                </span>

              </div>


              {/* PRODUCTS */}

              <div className="mt-6 space-y-5">

                {cartItems.map((item) => (

                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex gap-4"
                  >

                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">

                      <Image
                        src={item.image}
                        alt={item.name || item.title || "Product"}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />

                    </div>


                    <div className="min-w-0 flex-1">

                      <h3 className="truncate text-sm font-semibold">
                        {item.name || item.title}
                      </h3>

                      <p className="mt-1 text-xs text-neutral-500">
                        Size: {item.size}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        Quantity: {item.quantity}
                      </p>

                    </div>


                    <p className="text-sm font-semibold">
                      ৳{Number(item.price) * Number(item.quantity)}
                    </p>

                  </div>

                ))}

              </div>


              <div className="my-6 border-t border-neutral-200" />


              {/* PRICE */}

              <div className="space-y-3 text-sm">

                <div className="flex justify-between">

                  <span className="text-neutral-500">
                    Subtotal
                  </span>

                  <span>
                    ৳{subtotal}
                  </span>

                </div>


                <div className="flex justify-between">

                  <span className="text-neutral-500">
                    Delivery
                  </span>

                  <span className="font-medium text-green-600">
                    Free
                  </span>

                </div>

              </div>


              <div className="my-5 border-t border-neutral-200" />


              <div className="flex items-end justify-between">

                <div>
                  <p className="text-sm text-neutral-500">
                    Total
                  </p>

                  <p className="mt-1 text-3xl font-bold tracking-tight">
                    ৳{totalPrice}
                  </p>
                </div>

                <span className="text-xs text-neutral-400">
                  BDT
                </span>

              </div>


              {/* PLACE ORDER */}

     <button
  type="button"
  disabled={loading}
  onClick={
    verifiedPhone
      ? handleFinalOrder
      : handlePlaceOrder
  }
  className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-4 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? (
    "Processing..."
  ) : verifiedPhone ? (
    <>
      <ShieldCheck size={18} />
      Place Order · ৳{totalPrice}
    </>
  ) : (
    <>
      <ShieldCheck size={18} />
      Continue to Verification
    </>
  )}
</button>


              {/* TRUST */}

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-neutral-400">

                <ShieldCheck size={14} />

                <span>
                  Secure checkout · Your information is protected
                </span>

              </div>

            </div>

          </aside>

        </div>

      </div>
    </div>
  );
};

export default CheckoutForm;