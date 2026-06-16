"use client";

import Image from "next/image";
import Link from "next/link";
import ViewDetails from "../Buttons/ViewDetails";

const ProductCard = ({ product }) => {
  return (
    <div className="card bg-white shadow-md hover:shadow-xl transition duration-300 group relative rounded-xl">

      {/* Product Image */}
      <figure className="relative overflow-hidden">
        <Link href={`/items/${product._id}`}>
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={500}
            unoptimized
            className="w-full h-72 object-cover group-hover:scale-105 transition duration-300 cursor-pointer"
          />
        </Link>

        {/* View Details Button (Hidden until hover) */}
       {/* View Details Button */}
<div
  className="
    absolute inset-0 flex items-center justify-center

    bg-black/40

    opacity-100
    md:opacity-0
    md:group-hover:opacity-100

    transition duration-300
  "
>
  <ViewDetails
    product={{ ...product, id: product._id.toString() }}
    type="id"
  />
</div>
      </figure>

      {/* Card Body */}
      <div className="card-body">
        <Link href={`/items/${product._id}`}>
          <h2 className="card-title text-lg cursor-pointer hover:underline">
            {product.name}
          </h2>
        </Link>

        <p className="text-sm opacity-70">{product.shortDescription || product.cottonType}</p>

        <div className="flex justify-between items-center mt-2">
          <span className="font-bold text-primary">৳ {product.price}</span>
          <span className="text-sm opacity-60">{product.sold} sold</span>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;