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
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const {
    name,
    price,
    cottonType,
    sold,
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
    title: `${name} | Your Store Name`,
    description,

    alternates: {
      canonical: productUrl,
    },

    openGraph: {
      type: "website",
      url: productUrl,
      title: name,
      description,
      siteName: "Your Store Name",
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
      images: [
        image || "https://i.ibb.co/60vvkRZ3/your-fallback.jpg",
      ],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        "max-image-preview": "large",
      },
    },
  };
}

const ProductDetails = async ({ params }) => {
  const { id } = params;
  const products = await getSingleProduct(id);

  if (!products) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Product Not Found
        </h1>
      </div>
    );
  }

  const discountPrice =
    products.discount > 0
      ? products.price - (products.price * products.discount) / 100
      : products.price;

  return (
    <main className="min-h-screen bg-neutral-50">

      {/* Breadcrumb */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-5 sm:py-4 lg:px-10">
          <nav className="flex min-w-0 items-center gap-2 overflow-x-auto whitespace-nowrap text-xs text-neutral-500 sm:text-sm">
            <Link
              href="/"
              className="shrink-0 transition hover:text-black"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href="/products"
              className="shrink-0 transition hover:text-black"
            >
              Products
            </Link>

            <span>/</span>

            <span className="max-w-[180px] truncate font-medium text-black sm:max-w-none">
              {products.name}
            </span>
          </nav>
        </div>
      </section>

      {/* Main Container */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-10 lg:px-10 lg:py-12">

        <div className="grid grid-cols-1 items-start gap-8 md:gap-10 lg:grid-cols-2 lg:gap-16">

          {/* LEFT SIDE */}
          <div className="lg:sticky lg:top-24">

            {/* Image */}
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md sm:rounded-3xl sm:shadow-lg">
              <ImageGallery product={products} />
            </div>

            {/* Feature Cards */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4">

              <div className="rounded-xl border border-neutral-200 bg-white p-3 sm:rounded-2xl sm:p-4">
                <p className="text-xs text-neutral-500 sm:text-sm">
                  Fabric
                </p>

                <h3 className="mt-1 truncate text-sm font-semibold sm:text-base">
                  {products.cottonType}
                </h3>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-3 sm:rounded-2xl sm:p-4">
                <p className="text-xs text-neutral-500 sm:text-sm">
                  Color
                </p>

                <h3 className="mt-1 truncate text-sm font-semibold sm:text-base">
                  {products.color}
                </h3>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-md sm:rounded-3xl sm:p-7 md:p-8 lg:shadow-lg">

            {/* Product Badge */}
            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 sm:px-4 sm:text-sm">
              Premium Collection
            </span>

            {/* Product Name */}
            <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-neutral-900 sm:mt-5 sm:text-3xl md:text-4xl">
              {products.name}
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-sm leading-relaxed text-neutral-500 sm:text-base">
              Crafted from premium {products.cottonType}. Designed for
              comfort, durability and timeless everyday style.
            </p>

            {/* Rating */}
            <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
              <div className="text-base text-yellow-500 sm:text-lg">
                ★★★★★
              </div>

              <span className="text-xs text-neutral-500 sm:text-sm">
                ({products.sold}+ Happy Customers)
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex flex-wrap items-center gap-2 sm:mt-8 sm:gap-4">

              <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl md:text-5xl">
                ৳{discountPrice}
              </h2>

              {products.discount > 0 && (
                <>
                  <span className="text-base text-neutral-400 line-through sm:text-xl">
                    ৳{products.price}
                  </span>

                  <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600 sm:px-3 sm:text-sm">
                    {products.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-neutral-200 sm:my-8" />

            {/* Product Information */}
            <div className="space-y-4 sm:space-y-5">

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-neutral-500 sm:text-base">
                  Fabric
                </span>

                <span className="max-w-[55%] truncate text-right text-sm font-semibold sm:text-base">
                  {products.cottonType}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-neutral-500 sm:text-base">
                  Color
                </span>

                <span className="max-w-[55%] truncate text-right text-sm font-semibold sm:text-base">
                  {products.color}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-neutral-500 sm:text-base">
                  Sold
                </span>

                <span className="text-sm font-semibold sm:text-base">
                  {products.sold} Pieces
                </span>
              </div>

            </div>

            {/* Actions */}
            <div className="mt-8 sm:mt-10">
              <ProductActions
                product={{
                  ...products,
                  id: products?._id?.toString?.() || products?._id,
                }}
              />
            </div>

            {/* Compare */}
            <div className="mt-4 sm:mt-5">
              <Link
                href={`/compare/${products._id}`}
                className="block"
              >
                <button className="w-full rounded-xl border border-neutral-300 py-3.5 text-sm font-semibold transition hover:bg-neutral-100 sm:py-4 sm:text-base">
                  Compare Product
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