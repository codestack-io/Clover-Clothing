"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import ViewDetails from "../Buttons/ViewDetails";

/**
 * ProductCard
 */
const ProductCard = ({
  product,
  onToggleWishlist = () => {},
  isWishlisted = false,
}) => {
  // Guard clause: Avoid rendering if product object is missing
  if (!product) return null;

  // Resolve ID safely whether it comes as product._id or product.id
  const productId = product._id?.toString() || product.id?.toString() || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      {/* Product Image */}
      <figure className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <Link
          href={`/products/${productId}`}
          aria-label={product.name || "Product"}
          className="absolute inset-0 z-0"
        >
          {product.image && (
            <Image
              src={product.image}
              alt={product.name || "Product Image"}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}
        </Link>

        {/* Fade overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Floating wishlist button */}
        <button
          type="button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => onToggleWishlist(product)}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-700 opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-neutral-900 hover:text-white group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
        >
          <Heart
            className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
            aria-hidden="true"
          />
        </button>

        {/* View Details */}
        <div
          className="
            absolute inset-x-0 bottom-0 z-20 flex justify-center pb-4
            opacity-100 translate-y-0
            md:translate-y-3 md:opacity-0
            md:group-hover:translate-y-0 md:group-hover:opacity-100
            transition-all duration-300
          "
        >
          <ViewDetails
            product={{
              ...product,
              id: productId,
            }}
            type="id"
          />
        </div>
      </figure>

      {/* Card Body */}
      <div className="flex flex-col gap-1.5 p-4">
        <Link href={`/products/${productId}`} className="w-fit">
          <h2 className="line-clamp-2 text-[15px] font-medium text-neutral-900 transition-colors duration-200 hover:text-green-700">
            {product.name}
          </h2>
        </Link>

        {(product.shortDescription || product.cottonType) && (
          <p className="line-clamp-1 text-sm text-neutral-500">
            {product.shortDescription || product.cottonType}
          </p>
        )}

        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-base font-semibold text-neutral-900">
            ৳ {product.price}
          </span>
          {product.sold != null && (
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500">
              {product.sold} sold
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;