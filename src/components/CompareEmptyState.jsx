"use client";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FaCodeCompare } from "react-icons/fa6";

export default function CompareEmptyState() {
  const router = useRouter();

  const handleRedirect = () => {
    Swal.fire({
      title: "No Products Selected",
      text: "You need to choose products before comparing.",
      icon: "info",
      confirmButtonText: "Go to Products",
      confirmButtonColor: "#16a34a",
    }).then(() => {
      router.push("/Products"); // change if your route is different
    });
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
      
      {/* Icon */}
      <div className="text-5xl mb-4 ml-40"><FaCodeCompare /></div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Compare Products
      </h2>

      {/* Message */}
      <p className="text-gray-500 mb-6">
        You haven’t selected any products yet. Start by choosing products you
        want to compare.
      </p>

      {/* Button */}
      <button
        onClick={handleRedirect}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition duration-300"
      >
        Browse Products
      </button>

      {/* Optional link */}
      <button
        onClick={() => router.push("/Products")}
        className="mt-3 text-sm text-gray-400 hover:text-gray-600 underline"
      >
        Go to product page
      </button>
    </div>
  );
}