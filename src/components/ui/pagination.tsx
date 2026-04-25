"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationMeta {
  page: number;
  totalPage: number;
  total: number;
  limit: number;
}

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
}

/** Compute visible page numbers with "..." placeholders. */
function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const result: (number | "...")[] = [1];
  const left = current - 2;
  const right = current + 2;

  if (left > 2) result.push("...");

  for (let i = Math.max(2, left); i <= Math.min(total - 1, right); i++) {
    result.push(i);
  }

  if (right < total - 1) result.push("...");
  if (total > 1) result.push(total);

  return result;
}

export function Pagination({ meta, onPageChange, className }: PaginationProps) {
  const { page, totalPage, total, limit } = meta;

  if (totalPage <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const pages = getPageRange(page, totalPage);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3",
        "px-4 sm:px-5 py-3.5 border-t border-gray-100",
        className
      )}
    >
      {/* Info text */}
      <p className="text-sm text-gray-500 order-2 sm:order-1">
        Showing{" "}
        <span className="font-medium text-gray-700">{from}–{to}</span>
        {" "}of{" "}
        <span className="font-medium text-gray-700">{total}</span>
        {" "}results
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="min-w-8 h-8 flex items-center justify-center text-sm text-gray-400 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                "min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-all",
                p === page
                  ? "text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              )}
              style={p === page ? { backgroundColor: "#1d3494" } : {}}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPage}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
