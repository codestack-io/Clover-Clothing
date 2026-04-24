import { getSingleProduct } from "@/action/server/product";
import CartButton from "@/components/Buttons/CartButton";
import ViewDetails from "@/components/Buttons/ViewDetails";
import Image from "next/image";
import React from "react";
import ProductActions from "@/components/productAction";

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
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Product Image */}
        <div className="relative w-full h-[500px]">
          <Image
            src={products.image}
            alt={products.name}
            fill
            className="object-cover rounded-xl shadow-lg" 
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{products.name}</h1>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-green-600">৳{products.price}</span>
          </div>

          <div className="space-y-2 text-gray-600">
            <p>
              <span className="font-semibold text-gray-800">Cotton Type:</span> {products.cottonType}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Sold:</span> {products.sold} pieces
            </p>
            <p>
              <span className="font-semibold text-gray-800">Color:</span> {products.color}
            </p>
          </div>

    
<div>
  <ProductActions product={{ ...products, id: products?._id?.toString?.() || products?._id }} />
</div>

          {/* Dedicated Compare button */}
          <div className="mt-4">
            <Link href={`/compare/${products._id}`}>
              <button className="bg-black text-white px-4 py-2 rounded-lg">
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