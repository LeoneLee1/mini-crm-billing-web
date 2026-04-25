"use client";

import { Pencil, Trash2, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableColumn } from "@/components/ui/table";
import { Customer } from "@/services/customers/customerTypes";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap",
        status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
      )}
    >
      {status === "active" ? "Active" : "Inactive"}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export default function CustomerTable({ customers, loading, onEdit, onDelete }: CustomerTableProps) {
  const columns: TableColumn<Customer>[] = [
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
      render: (c) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: "#4a6ee0" }}
          >
            {c.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-800">{c.name}</span>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      cellClassName: "text-gray-600",
      render: (c) => c.phone,
    },
    {
      key: "email",
      header: "Email",
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell text-gray-500",
      render: (c) => c.email || <span className="text-gray-300 italic text-xs">—</span>,
    },
    {
      key: "address",
      header: "Address",
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell text-gray-500 max-w-48 truncate",
      render: (c) => c.address,
    },
    {
      key: "status",
      header: "Status",
      render: (c) => <StatusBadge status={c.status} />,
    },
    {
      key: "created_at",
      header: "Created At",
      headerClassName: "hidden xl:table-cell",
      cellClassName: "hidden xl:table-cell text-gray-500 whitespace-nowrap",
      render: (c) => formatDate(c.created_at),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-center w-20",
      render: (c) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(c)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(c)}
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
      data={customers}
      keyExtractor={(c) => c.id}
      loading={loading}
      emptyText="No customers found."
      emptyIcon={<Building2 className="w-10 h-10 text-gray-300" />}
      renderMobileItem={(c) => (
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: "#4a6ee0" }}
          >
            {c.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-gray-800 text-sm truncate">{c.name}</span>
              <StatusBadge status={c.status} />
            </div>
            <p className="text-xs text-gray-500 truncate mt-0.5">{c.phone}</p>
            {c.email && <p className="text-xs text-gray-400 truncate">{c.email}</p>}
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => onEdit(c)}
              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(c)}
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
