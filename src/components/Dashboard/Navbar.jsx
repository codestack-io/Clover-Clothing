"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell, Moon, Sun, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "./Breadcrumb";

function pageTitleFromPath(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  if (!last || last === "dashboard") return "Dashboard";
  return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Navbar({ onOpenMobile }) {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false); // UI only — no theme logic wired yet
  const title = pageTitleFromPath(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-8">
        {/* Left: mobile trigger + title/breadcrumb */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onOpenMobile}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <Breadcrumb />
            <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: search, bell, theme toggle, profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search..."
              className="w-56 rounded-lg border-slate-200 bg-slate-50 pl-9 text-sm focus-visible:ring-emerald-500 lg:w-72"
            />
          </div>

          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </button>

          <button
            onClick={() => setDarkMode((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            {darkMode ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-slate-100 focus:outline-none">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="Admin" />
                <AvatarFallback className="bg-emerald-100 text-xs font-semibold text-emerald-700">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium leading-none text-slate-800">Admin</p>
                <p className="mt-0.5 text-xs text-slate-400">Owner</p>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                 <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                Logout
              </DropdownMenuItem>
              
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}