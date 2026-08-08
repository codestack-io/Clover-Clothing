"use client";

import { clearCart } from "../../action/server/cart";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const session_id = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");
  const method = searchParams.get("method");

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const handleSuccess = async () => {
      if (method === "stripe" && !session_id) {
        await Swal.fire({
          icon: "error",
          title: "Invalid payment",
          text: "Missing Stripe session.",
        });
        window.location.href = "/";
        return;
      }

      try {
        // ✅ Update order (for Stripe or others)
        const res = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            paymentId: session_id,
            paymentMethod: method,
          }),
        });

        const data = await res.json();

        if (!data?.success) {
          await Swal.fire({
            icon: "error",
            title: "Order Failed",
            text: data?.error || "Something went wrong.",
          });
          return;
        }

        // ✅ Fetch updated order
        const orderRes = await fetch(`/api/orders/${orderId}`);
        const orderData = await orderRes.json();

        if (orderData.success) {
          setOrder(orderData.order);

          // 🔥 CLEAR CART HERE
        await clearCart();

          // 🔥 FORCE UI REFRESH
          router.refresh();
        }

        // ✅ Success message
        await Swal.fire({
          title: "Payment Successful 🎉",
          html: `
            <p>Thank you for your purchase.</p>
            <p><strong>Method:</strong> ${method}</p>
            ${
              session_id
                ? `<p><strong>Session:</strong> ${session_id}</p>`
                : ""
            }
          `,
          icon: "success",
        });

      } catch (error) {
        console.error("🔥 Error:", error);
        await Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong.",
        });
      }
    };

    if (orderId) {
      handleSuccess();
    }
  }, [session_id, method, orderId, router]);

 return (
  <div className="min-h-screen bg-[#fafafa] px-4 py-10 sm:px-6 lg:px-8">
    
    {/* Background decoration */}
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="absolute -right-32 top-40 h-72 w-72 rounded-full bg-purple-200/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-pink-200/20 blur-3xl" />
    </div>

    <div className="mx-auto max-w-5xl">

      {/* =========================
          SUCCESS HEADER
      ========================= */}

      <div className="mb-10 text-center">

        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        </div>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
          Clover Clothing
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          Order confirmed
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-neutral-500">
          Thank you for your purchase. Your order has been successfully
          placed and we'll keep you updated about its delivery.
        </p>

        {order && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            
            <span className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-600 shadow-sm">
              Order #{orderId?.slice(-8)}
            </span>

            <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-medium capitalize text-emerald-700">
              {method === "stripe"
                ? "Card payment"
                : method === "cash"
                ? "Cash on delivery"
                : method}
            </span>

          </div>
        )}

      </div>


      {/* =========================
          MAIN GRID
      ========================= */}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">


        {/* =========================
            LEFT — ORDER DETAILS
        ========================= */}

        <div className="space-y-6">

          {/* PRODUCTS CARD */}

          <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5 sm:px-7">

              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Your order
                </h2>

                <p className="mt-1 text-xs text-neutral-500">
                  {order?.items?.length || 0} product
                  {order?.items?.length === 1 ? "" : "s"}
                </p>
              </div>

              <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">
                Confirmed
              </span>

            </div>


            {/* PRODUCT LIST */}

            <div className="divide-y divide-neutral-100">

              {order?.items?.map((item, index) => (

                <div
                  key={index}
                  className="flex gap-4 px-6 py-5 sm:px-7"
                >

                  {/* IMAGE */}

                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-neutral-100">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title || "Product"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                        No image
                      </div>
                    )}

                  </div>


                  {/* PRODUCT INFO */}

                  <div className="min-w-0 flex-1">

                    <h3 className="truncate text-sm font-semibold text-neutral-900 sm:text-base">
                      {item.title || item.name || "Product"}
                    </h3>

                    {item.size && (
                      <p className="mt-1 text-xs text-neutral-500">
                        Size: {item.size}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-neutral-500">
                      Quantity: {item.quantity}
                    </p>

                  </div>


                  {/* PRICE */}

                  <div className="text-right">

                    <p className="text-sm font-semibold text-neutral-900 sm:text-base">
                      ৳
                      {(
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                      ).toLocaleString()}
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                      ৳{Number(item.price || 0).toLocaleString()} each
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </section>


          {/* =========================
              DELIVERY TIMELINE
          ========================= */}

          <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7">

            <h2 className="text-lg font-semibold text-neutral-900">
              Delivery status
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              We'll keep you updated as your order moves through each stage.
            </p>


            <div className="mt-7">

              {/* STEP 1 */}

              <div className="flex gap-4">

                <div className="flex flex-col items-center">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
                    ✓
                  </div>

                  <div className="mt-1 h-12 w-px bg-emerald-200" />

                </div>

                <div className="pb-6">

                  <p className="text-sm font-semibold text-neutral-900">
                    Order confirmed
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    Your order has been received successfully.
                  </p>

                </div>

              </div>


              {/* STEP 2 */}

              <div className="flex gap-4">

                <div className="flex flex-col items-center">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-neutral-200 bg-white text-neutral-400">
                    2
                  </div>

                  <div className="mt-1 h-12 w-px bg-neutral-200" />

                </div>

                <div className="pb-6">

                  <p className="text-sm font-semibold text-neutral-700">
                    Processing
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    We're preparing your items for shipment.
                  </p>

                </div>

              </div>


              {/* STEP 3 */}

              <div className="flex gap-4">

                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-neutral-200 bg-white text-neutral-400">
                  3
                </div>

                <div>

                  <p className="text-sm font-semibold text-neutral-700">
                    Out for delivery
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    Your order will be on its way to you.
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* =========================
              SHIPPING INFORMATION
          ========================= */}

          {order && (
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
                  📍
                </div>

                <div>

                  <h2 className="text-lg font-semibold text-neutral-900">
                    Delivery address
                  </h2>

                  <p className="text-xs text-neutral-500">
                    Your order will be delivered here
                  </p>

                </div>

              </div>


              <div className="mt-5 rounded-2xl bg-neutral-50 p-4">

                <p className="text-sm font-medium text-neutral-900">
                  {order.address}
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  {order.city}
                  {order.postalCode && ` — ${order.postalCode}`}
                </p>

                {order.phone && (
                  <p className="mt-3 text-xs text-neutral-500">
                    Phone:{" "}
                    <span className="font-medium text-neutral-700">
                      {order.phone}
                    </span>
                  </p>
                )}

              </div>

            </section>
          )}

        </div>


        {/* =========================
            RIGHT — SUMMARY
        ========================= */}

        <aside className="h-fit lg:sticky lg:top-24">

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-neutral-900">
              Order summary
            </h2>


            <div className="mt-6 space-y-4 text-sm">

              <div className="flex justify-between">

                <span className="text-neutral-500">
                  Subtotal
                </span>

                <span className="font-medium text-neutral-900">
                  ৳
                  {Number(order?.totalPrice || 0).toLocaleString()}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-neutral-500">
                  Delivery
                </span>

                <span className="font-medium text-emerald-600">
                  Free
                </span>

              </div>

            </div>


            <div className="my-5 border-t border-neutral-100" />


            <div className="flex items-end justify-between">

              <div>

                <p className="text-xs text-neutral-500">
                  Total paid
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-neutral-900">
                  ৳
                  {Number(order?.totalPrice || 0).toLocaleString()}
                </p>

              </div>

              <span className="text-xs text-neutral-400">
                BDT
              </span>

            </div>


            {/* PAYMENT */}

            <div className="mt-6 rounded-2xl bg-neutral-50 p-4">

              <div className="flex items-center justify-between">

                <span className="text-xs text-neutral-500">
                  Payment method
                </span>

                <span className="text-xs font-semibold capitalize text-neutral-900">
                  {method === "stripe"
                    ? "Card"
                    : method === "cash"
                    ? "Cash on Delivery"
                    : method}
                </span>

              </div>

            </div>


            {/* BUTTON */}

            <button
              onClick={() => router.push("/products")}
              className="mt-6 w-full rounded-2xl bg-black py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-lg"
            >
              Continue Shopping
            </button>


            <button
              onClick={() => router.push("/orders")}
              className="mt-3 w-full rounded-2xl border border-neutral-200 bg-white py-3.5 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
            >
              View My Orders
            </button>


            {/* TRUST */}

            <div className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-neutral-400">

              <span>🔒</span>

              <span>
                Secure checkout · Your information is protected
              </span>

            </div>

          </div>

        </aside>

      </div>


      {/* =========================
          FOOTER MESSAGE
      ========================= */}

      <div className="mt-10 text-center">

        <p className="text-sm text-neutral-500">
          Need help with your order?
        </p>

        <button
          onClick={() => router.push("/contact")}
          className="mt-1 text-sm font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
        >
          Contact Clover Clothing
        </button>

      </div>

    </div>
  </div>
);
}