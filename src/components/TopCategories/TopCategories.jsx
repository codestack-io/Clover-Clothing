"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import CategoryCard from "@/components/Card/CategoryCard";
import CategorySkeleton from "@/components/Skeleton/Categoryskeleton";

const TopCategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) {
          const text = await res.text();
          console.error("API Error:", res.status, text);
          throw new Error("Failed to fetch categories");
        }
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section aria-labelledby="top-categories-heading" className="w-full bg-white py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header ------------------------------------------------------ */}
        <div className="mx-auto max-w-2xl text-center">
         
        <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-neutral-500"
          >
            Discover carefully selected clothing collections for every style
            and occasion.
          </motion.p>
        </div>

        {/* Grid ---------------------------------------------------------- */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {isLoading ? (
            Array(4)
              .fill(0)
              .map((_, index) => <CategorySkeleton key={index} />)
          ) : categories.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 py-16 text-center lg:col-span-4">
              <p className="text-sm font-medium text-neutral-500">
                Categories will appear here once they're available.
              </p>
            </div>
          ) : (
            categories.map((category, index) => (
              <CategoryCard
                key={category._id || category.id || category.slug || index}
                category={category}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default TopCategoriesSection;