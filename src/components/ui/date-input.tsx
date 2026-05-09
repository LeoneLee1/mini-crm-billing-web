"use client";

import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateInputProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  className?: string;
  error?: boolean;
}

function toDisplay(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!d || !m || !y) return iso;
  return `${d}/${m}/${y}`;
}

export function DateInput({ value, onChange, className, error }: DateInputProps) {
  return (
    <div className="relative">
      {/* Display layer — pointer-events-none agar klik tembus ke date input di bawahnya */}
      <input
        type="text"
        readOnly
        tabIndex={-1}
        value={toDisplay(value)}
        placeholder="DD/MM/YYYY"
        className={cn(
          "w-full px-3.5 py-2.5 rounded-lg border text-sm placeholder:text-gray-400 bg-white pointer-events-none select-none pr-10",
          error ? "border-red-400 bg-red-50/30" : "border-gray-200",
          className
        )}
      />
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
      {/* Native date picker — transparan tapi menutupi seluruh area, klik langsung buka picker */}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
}
