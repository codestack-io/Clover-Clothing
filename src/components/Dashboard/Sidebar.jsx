"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  BarChart3,
  Star,
  Image as ImageIcon,
  Ticket,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft,
  Sprout,
  X,
} from "lucide-react";
import NavItem from "./NavItem";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/products", icon: Package, label: "Products" },
  { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/dashboard/customers", icon: Users, label: "Customers" },
  { href: "/dashboard/categories", icon: FolderTree, label: "Categories" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/reviews", icon: Star, label: "Reviews" },
  { href: "/dashboard/banners", icon: ImageIcon, label: "Banners" },
  { href: "/dashboard/coupons", icon: Ticket, label: "Coupons" },
  { href: "/dashboard/settings", icon: SettingsIcon, label: "Settings" },
];

function Logo({ collapsed }) {
  return (
    <div className={cn("flex items-center gap-2 px-3", collapsed && "justify-center px-0")}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-200">
        <Sprout className="h-5 w-5" />
      </div>
      {!collapsed && (
        <span className="truncate text-[15px] font-semibold tracking-tight text-slate-900">
          Clover Clothing
        </span>
      )}
    </div>
  );
}

function SidebarContent({ collapsed, onToggleCollapse, onNavClick, showCollapseToggle = true }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo + collapse toggle */}
      <div className="flex items-center justify-between py-5">
        <Logo collapsed={collapsed} />
        {showCollapseToggle && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              "hidden h-6 w-6 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 hover:text-slate-600 lg:flex",
              collapsed && "mx-auto mt-2"
            )}
          >
            <ChevronLeft
              className={cn("h-3.5 w-3.5 transition-transform duration-300", collapsed && "rotate-180")}
            />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-100 p-3">
        <button
          onClick={() => {
            // TODO: wire up next-auth signOut()
            console.log("Logout clicked");
          }}
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}

/**
 * Sidebar
 * Desktop: in-flow collapsible column (persists collapsed state via parent).
 * Mobile: animated drawer with backdrop, controlled by `mobileOpen`.
 */
export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden shrink-0 border-r border-slate-100 bg-white lg:block"
      >
        <SidebarContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl lg:hidden"
            >
              <div className="absolute right-3 top-4">
                <button
                  onClick={onCloseMobile}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SidebarContent collapsed={false} onNavClick={onCloseMobile} showCollapseToggle={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}