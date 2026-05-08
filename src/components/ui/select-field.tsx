"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export function SelectField({ value, onChange, options, placeholder, className, error }: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center justify-between gap-2 w-full px-3.5 py-2.5 rounded-lg border bg-white text-sm transition-all",
          "focus:outline-none",
          open
            ? "border-blue-500 ring-2 ring-blue-500/15"
            : error
            ? "border-red-400 ring-2 ring-red-400/15"
            : "border-gray-200 hover:border-gray-300"
        )}
      >
        <span className={cn("truncate", selected ? "text-gray-700" : "text-gray-400")}>
          {selected?.label ?? placeholder ?? "Select..."}
        </span>
        <ChevronDown
          className={cn("w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full min-w-40 rounded-xl border border-gray-200 bg-white shadow-lg shadow-black/6 overflow-hidden">
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => { onChange(option.value); setOpen(false); }}
                className={cn(
                  "flex items-center justify-between w-full px-3.5 py-2.5 text-sm text-left transition-colors",
                  isSelected
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                )}
              >
                {option.label}
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-blue-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
