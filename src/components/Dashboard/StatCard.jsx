"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * StatCard
 * Props:
 * - icon: Lucide icon component
 * - title: string
 * - value: string | number
 * - growth: number (e.g. 12.4 or -3.2) — percentage change
 */
export default function StatCard({ icon: Icon, title, value, growth = 0 }) {
  const isPositive = growth >= 0;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
            isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
          )}
        >
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(growth)}%
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
    </motion.div>
  );
}