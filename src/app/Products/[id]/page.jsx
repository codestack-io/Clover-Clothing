import { getSingleProduct } from "../../../action/server/Product";

import Image from "next/image";
import React from "react";
import ProductActions from "../../../components/productAction";

import Link from "next/link";

export async function generateMetadata({ params }) {
 const {id} = await params;
   
  
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

  console.log("PRODUCT:", products);

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
 const {id} = await params;
  const products = await getSingleProduct(id);

  if (!products) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl font-semibold text-red-500">
          Product Not Found
        </h2>
      </div>
    );
  }


  const {
    name,
    price,
    cottonType,
    sold,
    image,
    discount = 0,
  } = products;
return (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
      
      {/* Product Image */}
      <div className="relative w-full h-[320px] sm:h-[450px] md:h-[500px]">
        <Image
          src={products.image}
          alt={products.name}
          fill
          className="object-cover rounded-xl shadow-lg"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-5">
        
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
          {products.name}
        </h1>

        {/* Price */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-2xl sm:text-3xl font-bold text-green-600">
            ৳{products.price}
          </span>

          {products.discount > 0 && (
            <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded">
              {products.discount}% OFF
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-2 text-sm sm:text-base text-gray-600">
          <p>
            <span className="font-semibold text-gray-800">
              Cotton Type:
            </span>{" "}
            {products.cottonType}
          </p>

          <p>
            <span className="font-semibold text-gray-800">
              Sold:
            </span>{" "}
            {products.sold} pieces
          </p>

          <p>
            <span className="font-semibold text-gray-800">
              Color:
            </span>{" "}
            {products.color}
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2">
          <ProductActions
            product={{
              ...products,
              id:
                products?._id?.toString?.() ||
                products?._id,
            }}
          />
        </div>

        {/* Compare Button */}
        <div className="pt-2">
          <Link href={`/compare/${products._id}`}>
            <button className="w-full sm:w-auto bg-black text-white px-5 py-3 rounded-lg hover:opacity-90 transition">
              Compare
            </button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);
}

export default ProductDetails;