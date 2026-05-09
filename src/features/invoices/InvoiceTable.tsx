"use client";

import { Pencil, Trash2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableColumn } from "@/components/ui/table";
import { Invoice, InvoiceStatus } from "@/services/invoices/invoiceTypes";

const STATUS_STYLES: Record<InvoiceStatus, { bg: string; text: string; label: string }> = {
  unpaid:    { bg: "bg-yellow-100", text: "text-yellow-700", label: "Unpaid" },
  paid:      { bg: "bg-green-100",  text: "text-green-700",  label: "Paid" },
  overdue:   { bg: "bg-red-100",    text: "text-red-600",    label: "Overdue" },
  cancelled: { bg: "bg-gray-100",   text: "text-gray-600",   label: "Cancelled" },
};

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.unpaid;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap",
        s.bg,
        s.text
      )}
    >
      {s.label}
    </span>
  );
}

function formatAmount(amount: number) {
  return `IDR ${Math.round(amount).toLocaleString("en-US")}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isDueDatePast(dueDateStr: string) {
  return new Date(dueDateStr) < new Date();
}

interface InvoiceTableProps {
  invoices: Invoice[];
  loading: boolean;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
}

export default function InvoiceTable({ invoices, loading, onEdit, onDelete }: InvoiceTableProps) {
  const columns: TableColumn<Invoice>[] = [
    {
      key: "no",
      header: "No",
      headerClassName: "w-10",
      cellClassName: "text-gray-400 font-medium",
      render: (_, index) => index + 1,
    },
    {
      key: "invoice_number",
      header: "Invoice #",
      render: (inv) => (
        <span className="font-mono text-xs font-semibold text-gray-700">{inv.invoice_number}</span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (inv) => (
        <div>
          <p className="font-medium text-gray-800 text-sm">{inv.transaction.customer.name}</p>
          <p className="text-xs text-gray-400">{inv.transaction.customer.email}</p>
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      cellClassName: "font-semibold text-gray-800 whitespace-nowrap",
      render: (inv) => formatAmount(inv.transaction.total),
    },
    {
      key: "due_date",
      header: "Due Date",
      headerClassName: "hidden sm:table-cell",
      cellClassName: "hidden sm:table-cell whitespace-nowrap",
      render: (inv) => (
        <span
          className={cn(
            "text-sm",
            inv.status === "unpaid" && isDueDatePast(inv.due_date)
              ? "text-red-500 font-semibold"
              : "text-gray-500"
          )}
        >
          {formatDate(inv.due_date)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (inv) => <StatusBadge status={inv.status} />,
    },
    {
      key: "created_at",
      header: "Created",
      headerClassName: "hidden xl:table-cell",
      cellClassName: "hidden xl:table-cell text-gray-500 whitespace-nowrap text-sm",
      render: (inv) => formatDate(inv.created_at),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-center w-20",
      render: (inv) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(inv)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="Update Status"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(inv)}
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
      data={invoices}
      keyExtractor={(inv) => inv.id}
      loading={loading}
      emptyText="No invoices found."
      emptyIcon={<FileText className="w-10 h-10 text-gray-300" />}
      renderMobileItem={(inv) => (
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: "#4a6ee0" }}
          >
            {inv.transaction.customer.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-gray-800 text-sm truncate">
                {inv.transaction.customer.name}
              </span>
              <StatusBadge status={inv.status} />
            </div>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">{inv.invoice_number}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs font-semibold text-gray-700">
                {formatAmount(inv.transaction.total)}
              </p>
              <span className="text-gray-300">·</span>
              <p
                className={cn(
                  "text-xs",
                  inv.status === "unpaid" && isDueDatePast(inv.due_date)
                    ? "text-red-500 font-semibold"
                    : "text-gray-400"
                )}
              >
                Due {formatDate(inv.due_date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => onEdit(inv)}
              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors"
              title="Update Status"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(inv)}
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
