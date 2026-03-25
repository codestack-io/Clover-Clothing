"use client";
import CartButton from "@/components/Buttons/CartButton";
import ViewDetails from "@/components/Buttons/ViewDetails"; // ✅ import the component
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoryPage({ params }) {
  const searchParams = useSearchParams();
  const cottonType = searchParams.get("cottonType");

  const [products, setProducts] = useState([]);

  useEffect(() => {
    let url = "/api/products";
    if (cottonType) url += `?cottonType=${cottonType}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("API returned not an array:", data);
          setProducts([]);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setProducts([]);
      });
  }, [cottonType]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
        {cottonType || params.category}
      </h1>

      {products.length === 0 && (
        <p className="text-gray-500 text-lg text-center my-16">
          No products found.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
          >
            <div className="relative">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-56 md:h-64 object-cover transition-transform duration-500 hover:scale-105"
              />
              <span className="absolute top-3 left-3 bg-emerald-700 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {p.cottonType}
              </span>
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <h2 className="font-semibold text-lg md:text-xl text-gray-800 mb-2 line-clamp-2">
                {p.name}
              </h2>
              <p className="text-gray-500 mb-2">Brand: {p.brand}</p>

              <div className="mt-auto flex items-center justify-between gap-2">
                <span className="bg-emerald-800 text-white font-bold text-lg px-2 py-1 rounded-lg">
                  ৳{p.price}
                </span>
                <CartButton product={p} />
              </div>

              {/* ✅ View Details button */}
              <div className="mt-2">
              <ViewDetails product={p} type="cottonType" />
              </div>

              <div className="mt-2 text-gray-400 text-sm">
                Sold: {p.sold}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}