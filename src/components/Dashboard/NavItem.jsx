"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * NavItem
 * A single sidebar navigation link with active-state highlighting.
 *
 * Props:
 * - href: string - route path
 * - icon: Lucide icon component
 * - label: string - link text
 * - collapsed: boolean - if true, only show icon (with tooltip-like title)
 * - onClick: optional click handler (used to close mobile drawer)
 */
export default function NavItem({ href, icon: Icon, label, collapsed = false, onClick }) {
  const pathname = usePathname();

  // Consider a route "active" if it matches exactly, or is a sub-route
  // (but avoid every route matching "/dashboard")
  const isActive =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        "hover:bg-emerald-50 hover:text-emerald-700",
        isActive ? "text-emerald-700" : "text-slate-600",
        collapsed && "justify-center px-2"
      )}
    >
      {/* Animated active background pill */}
      {isActive && (
        <motion.span
          layoutId="active-nav-pill"
          className="absolute inset-0 rounded-lg bg-emerald-50 ring-1 ring-emerald-100"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}

      <Icon
        className={cn(
          "relative z-10 h-[18px] w-[18px] shrink-0",
          isActive ? "text-emerald-600" : "text-slate-500"
        )}
      />

      {!collapsed && (
        <span className="relative z-10 truncate">{label}</span>
      )}

      {/* Active indicator dot when collapsed */}
      {collapsed && isActive && (
        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
      )}
    </Link>
  );
}