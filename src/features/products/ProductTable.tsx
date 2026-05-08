"use client";

import { Pencil, Trash2, Package } from "lucide-react";
import { Table, TableColumn } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Product } from "@/services/products/productTypes";

function formatPrice(price: number) {
  return `IDR ${Math.round(price).toLocaleString("id-ID")}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({ products, loading, onEdit, onDelete }: ProductTableProps) {
  const columns: TableColumn<Product>[] = [
    {
      key: "no",
      header: "No",
      headerClassName: "w-10",
      cellClassName: "text-gray-400 font-medium",
      render: (_, index) => index + 1,
    },
    {
      key: "name",
      header: "Name",
      render: (p) => (
        <div>
          <p className="font-medium text-gray-800">{p.name}</p>
          {p.category && <p className="text-xs text-gray-400 mt-0.5">{p.category}</p>}
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      cellClassName: "font-medium text-gray-700 whitespace-nowrap",
      render: (p) => (
        <div>
          <span>{formatPrice(p.price)}</span>
          <span className="text-xs text-gray-400 ml-1">/ {p.unit}</span>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell text-gray-500 max-w-56 truncate",
      render: (p) => p.description || <span className="text-gray-300 italic text-xs">—</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (p) => <StatusBadge status={p.is_active ? "active" : "inactive"} />,
    },
    {
      key: "created_at",
      header: "Created At",
      headerClassName: "hidden xl:table-cell",
      cellClassName: "hidden xl:table-cell text-gray-500 whitespace-nowrap",
      render: (p) => formatDate(p.created_at),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-center w-20",
      render: (p) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(p)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(p)}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={products}
      keyExtractor={(p) => p.id}
      loading={loading}
      emptyText="No products found."
      emptyIcon={<Package className="w-10 h-10 text-gray-300" />}
      renderMobileItem={(p) => (
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: "#4a6ee0" }}
          >
            {p.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-gray-800 text-sm truncate">{p.name}</span>
              <StatusBadge status={p.is_active ? "active" : "inactive"} />
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              {formatPrice(p.price)}{" "}
              <span className="text-gray-400">/ {p.unit}</span>
            </p>
            {p.category && <p className="text-xs text-gray-400">{p.category}</p>}
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => onEdit(p)}
              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(p)}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    />
  );
}
