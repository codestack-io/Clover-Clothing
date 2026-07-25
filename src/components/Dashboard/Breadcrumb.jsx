"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

function formatSegment(segment) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // e.g. ["dashboard", "products"]

  // Build cumulative hrefs: ["/dashboard", "/dashboard/products"]
  const crumbs = segments.map((seg, i) => ({
    label: formatSegment(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400">
      <Link href="/dashboard" className="flex items-center hover:text-slate-600">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3" />
          {crumb.isLast ? (
            <span className="font-medium text-slate-600">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-slate-600">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}