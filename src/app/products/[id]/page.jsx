import { getSingleProduct } from "../../../action/server/Product";
import Image from "next/image";
import React from "react";
import ProductActions from "../../../components/productAction";
import ImageGallery from "./ImageGallery";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { id } = params;
  const products = await getSingleProduct(id);

  if (!products) {
    return {
      title: "Product Not Found",
      robots: { index: false, follow: false },
    };
  }

  const {
    name = "Product",
    price = 0,
    cottonType = "Premium Cotton",
    sold = 0,
    image,
    discount = 0,
  } = products;

  const discountPrice = price - (price * discount) / 100;
  const productUrl = `https://clover-clothing.vercel.app/products/${id}`;

  const description = `${name} made with premium ${cottonType}. ${
    discount > 0
      ? `Now available for ৳${discountPrice.toFixed(0)} (${discount}% OFF).`
      : `Available now for ৳${price}.`
  } Sold: ${sold} pieces. Order now!`;

  return {
    title: `${name} | Clover Clothing`,
    description,
    alternates: { canonical: productUrl },
    openGraph: {
      type: "website",
      url: productUrl,
      title: name,
      description,
      siteName: "Clover Clothing",
      images: [
        {
          url: image || "https://i.ibb.co/60vvkRZ3/your-fallback.jpg",
          width: 1200,
          height: 1200,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: [image || "https://i.ibb.co/60vvkRZ3/your-fallback.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { "max-image-preview": "large" },
    },
  };
}

const ProductDetails = async ({ params }) => {
  const { id } = params;
  const products = await getSingleProduct(id);

  if (!products) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5">
        <h1 className="text-xl font-bold sm:text-2xl">Product Not Found</h1>
      </div>
    );
  }

  const fabricText = products.cottonType || products.fabric || "Premium Cotton";
  const colorText = products.color || "N/A";
  const soldCount = products.sold ?? 0;
  const productPrice = products.price ?? 0;
  const productDiscount = products.discount ?? 0;

  const discountPrice =
    productDiscount > 0
      ? productPrice - (productPrice * productDiscount) / 100
      : productPrice;

  return (
    <main className="min-h-screen bg-white pb-12 lg:bg-neutral-50">
      {/* Breadcrumb Navigation */}
      <section className="border-b bg-neutral-50/50 lg:bg-white">
        <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-5 sm:py-3.5 lg:px-10">
          <nav className="flex min-w-0 items-center gap-1.5 overflow-x-auto whitespace-nowrap text-[11px] text-neutral-500 sm:text-xs">
            <Link href="/" className="shrink-0 transition hover:text-black">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="shrink-0 transition hover:text-black">
              Products
            </Link>
            <span>/</span>
            <span className="max-w-[150px] truncate font-medium text-black sm:max-w-none">
              {products.name}
            </span>
          </nav>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-0 py-0 sm:px-5 sm:py-6 lg:px-10 lg:py-10">
        <div className="grid grid-cols-1 items-start gap-0 lg:grid-cols-2 lg:gap-12">
          
          {/* LEFT SIDE: Image Gallery & Mobile Highlights */}
          <div className="lg:sticky lg:top-24">
            <div className="overflow-hidden border-b border-neutral-100 sm:rounded-2xl sm:border sm:border-neutral-200 sm:bg-white sm:shadow-sm">
              <ImageGallery product={products} />
            </div>

            {/* Quick Specs Cards (Shown on Tablet/Desktop) */}
            <div className="hidden grid-cols-2 gap-3 p-4 sm:grid lg:mt-4 lg:p-0">
              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50 p-3.5">
                <p className="text-xs text-neutral-500">Fabric</p>
                <h3 className="mt-0.5 truncate text-sm font-semibold text-neutral-900">
                  {fabricText}
                </h3>
              </div>
              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50 p-3.5">
                <p className="text-xs text-neutral-500">Color</p>
                <h3 className="mt-0.5 truncate text-sm font-semibold text-neutral-900">
                  {colorText}
                </h3>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Details & Actions */}
          <div className="bg-white px-4 py-6 sm:rounded-2xl sm:border sm:border-neutral-200 sm:p-7 sm:shadow-sm">
            
            {/* Collection Badge & Rating */}
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:text-xs">
                Premium Collection
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-amber-400 sm:text-sm">★</span>
                <span className="text-xs font-semibold text-neutral-800">4.9</span>
                <span className="text-[11px] text-neutral-400">
                  ({soldCount > 0 ? `${soldCount}+` : "100+"} sold)
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="mt-2.5 text-xl font-bold leading-tight text-neutral-900 sm:mt-3 sm:text-2xl md:text-3xl">
              {products.name}
            </h1>

            {/* Price Tag */}
            <div className="mt-3 flex items-baseline gap-2.5 sm:mt-4">
              <span className="text-2xl font-extrabold text-neutral-900 sm:text-3xl">
                ৳{discountPrice.toLocaleString()}
              </span>

              {productDiscount > 0 && (
                <>
                  <span className="text-sm text-neutral-400 line-through sm:text-base">
                    ৳{productPrice.toLocaleString()}
                  </span>
                  <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600">
                    {productDiscount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Subtitle / Description */}
            <p className="mt-3 text-xs leading-relaxed text-neutral-600 sm:text-sm">
              Crafted from high-grade {fabricText}. Designed for long-lasting comfort, ideal weight, and effortless daily styling.
            </p>

            <div className="my-5 border-t border-neutral-100 sm:my-6" />

            {/* Specs Grid for Mobile */}
            <div className="grid grid-cols-2 gap-2.5 rounded-xl bg-neutral-50 p-3 text-xs sm:grid-cols-3">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-neutral-400">Fabric</span>
                <span className="font-semibold text-neutral-800">{fabricText}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-neutral-400">Color</span>
                <span className="font-semibold text-neutral-800">{colorText}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-neutral-400">Orders</span>
                <span className="font-semibold text-neutral-800">{soldCount} Pieces</span>
              </div>
            </div>

            {/* Actions (Add to Cart / Size Selector) */}
            <div className="mt-6">
              <ProductActions
                product={{
                  ...products,
                  id: products?._id?.toString?.() || products?._id,
                }}
              />
            </div>

            {/* Compare Button */}
            <div className="mt-3 sm:mt-4">
              <Link href={`/compare/${products._id}`} className="block">
                <button className="w-full rounded-xl border border-neutral-200 bg-white py-3 text-xs font-semibold text-neutral-700 transition active:scale-[0.98] sm:py-3.5 sm:text-sm">
                  Compare Product Specs
                </button>
              </Link>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;