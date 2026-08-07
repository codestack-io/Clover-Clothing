"use client";

import { useState } from "react";
import Image from "next/image";

const ImageGallery = ({ product }) => {
  // If your product has multiple images use them,
  // otherwise fallback to the main image.
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="sticky top-24">

      <div className="flex flex-col-reverse lg:flex-row gap-5">

        {/* Thumbnail List */}

        <div className="flex lg:flex-col gap-4 overflow-x-auto">

          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-all duration-300
              ${
                selectedImage === img
                  ? "border-black"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={img}
                alt={`${product.name}-${index}`}
                fill
                className="object-cover"
              />
            </button>
          ))}

        </div>

        {/* Main Image */}

        <div className="relative flex-1 overflow-hidden rounded-3xl bg-white border shadow-xl">

          {/* Discount Badge */}

          {product.discount > 0 && (
            <div className="absolute left-5 top-5 z-20 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
              {product.discount}% OFF
            </div>
          )}

          {/* Image */}

          <div className="relative aspect-square overflow-hidden">

            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-110"
            />

          </div>

        </div>

      </div>

      {/* Product Image Counter */}

      <div className="mt-5 flex justify-center gap-2">

        {images.map((img, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300
              ${
                selectedImage === img
                  ? "w-8 bg-black"
                  : "w-2 bg-gray-300"
              }`}
          />
        ))}

      </div>

    </div>
  );
};

export default ImageGallery;