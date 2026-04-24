"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, LogOut, ChevronDown, Menu } from "lucide-react";

interface HeaderProps {
  pageTitle: string;
  onMenuClick: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Header({ pageTitle, onMenuClick }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [greeting] = useState(getGreeting);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
      {/* Left: hamburger (mobile) + page title + greeting */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight truncate">
            {pageTitle}
          </h1>
          {greeting && (
            <p className="text-xs sm:text-sm text-gray-400 leading-tight" suppressHydrationWarning>
              {greeting}, Daniel Lee
            </p>
          )}
        </div>
      </div>

      {/* Right: avatar + dropdown */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 sm:gap-2.5 rounded-xl px-2 sm:px-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: "#1d3494" }}
          >
            DL
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700">Daniel Lee</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
            <button
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Settings className="w-4 h-4 text-gray-400" />
              Settings
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <LogOut className="w-4 h-4 text-red-400" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
