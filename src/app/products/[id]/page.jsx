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
      images: [image || "https://i.ibb.co/60vvkRZ3/your-fallback.jpg"],
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
      </div>
    );
  }

  const discountPrice =
    products.discount > 0
      ? products.price - (products.price * products.discount) / 100
      : products.price;

  return (
    <main className="bg-neutral-50 min-h-screen">
      {/* Breadcrumb */}
      <section className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-4">
          <nav className="flex items-center gap-2 text-sm text-neutral-500">
            <Link href="/" className="hover:text-black transition">
              Home
            </Link>

            <span>/</span>

            <Link href="/products" className="hover:text-black transition">
              Products
            </Link>

            <span>/</span>

            <span className="text-black font-medium">{products.name}</span>
          </nav>
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-7xl mx-auto px-5 lg:px-10 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* LEFT SIDE */}
          <div className="sticky top-24">
            <div className="overflow-hidden rounded-3xl bg-white border border-neutral-200 shadow-lg">
            <ImageGallery product={products} />
            </div>

            {/* Small Feature Cards */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="rounded-2xl bg-white border p-4">
                <p className="text-sm text-neutral-500">Fabric</p>
                <h3 className="font-semibold mt-1">{products.cottonType}</h3>
              </div>

              <div className="rounded-2xl bg-white border p-4">
                <p className="text-sm text-neutral-500">Color</p>
                <h3 className="font-semibold mt-1">{products.color}</h3>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-lg p-8">
            {/* Product Badge */}
            <span className="inline-flex rounded-full bg-green-100 text-green-700 px-4 py-1 text-sm font-medium">
              Premium Collection
            </span>

            {/* Product Name */}
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-neutral-900">
              {products.name}
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-neutral-500 leading-relaxed">
              Crafted from premium {products.cottonType}. Designed for
              comfort, durability and timeless everyday style.
            </p>

            {/* Rating */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex text-yellow-500 text-lg">★★★★★</div>

              <span className="text-sm text-neutral-500">
                ({products.sold}+ Happy Customers)
              </span>
            </div>

            {/* Price */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <h2 className="text-5xl font-bold text-neutral-900">
                ৳{discountPrice}
              </h2>

              {products.discount > 0 && (
                <>
                  <span className="text-xl line-through text-neutral-400">
                    ৳{products.price}
                  </span>

                  <span className="rounded-full bg-red-100 text-red-600 px-3 py-1 text-sm font-semibold">
                    {products.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="my-8 border-t border-neutral-200"></div>

            {/* Product Information */}
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Fabric</span>
                <span className="font-semibold">{products.cottonType}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Color</span>
                <span className="font-semibold">{products.color}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Sold</span>
                <span className="font-semibold">{products.sold} Pieces</span>
              </div>
            </div>

           
            

            {/* Actions */}
            <div className="mt-10">
              <ProductActions
                product={{
                  ...products,
                  id: products?._id?.toString?.() || products?._id,
                }}
              />
            </div>

            {/* Compare */}
            <div className="mt-5">
              <Link href={`/compare/${products._id}`}>
                <button className="w-full rounded-xl border border-neutral-300 py-4 font-semibold hover:bg-neutral-100 transition">
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