"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T, index: number) => ReactNode;
  /** Extra classes applied to <th> — e.g. "hidden lg:table-cell w-10" */
  headerClassName?: string;
  /** Extra classes applied to <td> — e.g. "hidden lg:table-cell text-gray-500" */
  cellClassName?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  emptyText?: string;
  emptyIcon?: ReactNode;
  /**
   * When provided: renders a card/list on mobile (< sm),
   * and the table on sm+.
   * When omitted: table is shown on all breakpoints with overflow-x-auto.
   */
  renderMobileItem?: (row: T, index: number) => ReactNode;
}

export function Table<T,>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyText = "No data found.",
  emptyIcon,
  renderMobileItem,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 border-3 border-gray-200 rounded-full animate-spin"
            style={{ borderTopColor: "#1d3494" }}
          />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        {emptyIcon}
        <p className="text-gray-400 text-sm">{emptyText}</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile card list — only rendered when renderMobileItem is provided */}
      {renderMobileItem && (
        <ul className="sm:hidden divide-y divide-gray-100">
          {data.map((row, index) => (
            <li key={keyExtractor(row)}>{renderMobileItem(row, index)}</li>
          ))}
        </ul>
      )}

      {/* Table — always rendered; hidden on mobile when card view is active */}
      <div
        className={cn(
          "overflow-x-auto",
          renderMobileItem && "hidden sm:block"
        )}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider",
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((row, index) => (
              <tr
                key={keyExtractor(row)}
                className="hover:bg-gray-50/50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-5 py-4", col.cellClassName)}
                  >
                    {col.render(row, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
