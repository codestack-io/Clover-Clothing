"use client";

import Link from "next/link";

const ViewDetails = ({ product }) => {
  return (
    <Link
      href={`/products/${product._id || product.id}`}
      className="bg-black text-white px-4 py-2 rounded-md text-center hover:bg-gray-800 transition"
    >
      View Details
    </Link>
  );
};

export default ViewDetails;