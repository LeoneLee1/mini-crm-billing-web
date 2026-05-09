"use client";

import { Pencil, Trash2, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableColumn } from "@/components/ui/table";
import { Transaction, TransactionStatus } from "@/services/transactions/transactionTypes";

const STATUS_STYLES: Record<TransactionStatus, { bg: string; text: string; label: string }> = {
  draft:     { bg: "bg-gray-100",  text: "text-gray-600",  label: "Draft" },
  confirmed: { bg: "bg-green-100", text: "text-green-700", label: "Confirmed" },
  cancelled: { bg: "bg-red-100",   text: "text-red-600",   label: "Cancelled" },
};

function StatusBadge({ status }: { status: TransactionStatus }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap", s.bg, s.text)}>
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

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export default function TransactionTable({ transactions, loading, onEdit, onDelete }: TransactionTableProps) {
  const columns: TableColumn<Transaction>[] = [
    {
      key: "no",
      header: "No",
      headerClassName: "w-10",
      cellClassName: "text-gray-400 font-medium",
      render: (_, index) => index + 1,
    },
    {
      key: "transaction_number",
      header: "Invoice",
      render: (t) => (
        <span className="font-mono text-xs font-semibold text-gray-700">
          {t.transaction_number ?? t.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (t) => <span className="font-medium text-gray-800">{t.customer?.name}</span>,
    },
    {
      key: "total",
      header: "Total",
      cellClassName: "font-semibold text-gray-800 whitespace-nowrap",
      render: (t) => formatAmount(t.total),
    },
    {
      key: "status",
      header: "Status",
      render: (t) => <StatusBadge status={t.status} />,
    },
    {
      key: "items",
      header: "Items",
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell text-gray-500",
      render: (t) => `${t.items?.length ?? 0} item(s)`,
    },
    {
      key: "created_at",
      header: "Date",
      headerClassName: "hidden xl:table-cell",
      cellClassName: "hidden xl:table-cell text-gray-500 whitespace-nowrap",
      render: (t) => formatDate(t.created_at),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-center w-20",
      render: (t) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(t)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(t)}
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
      data={transactions}
      keyExtractor={(t) => t.id}
      loading={loading}
      emptyText="No transactions found."
      emptyIcon={<Receipt className="w-10 h-10 text-gray-300" />}
      renderMobileItem={(t) => (
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: "#4a6ee0" }}
          >
            {t.customer?.name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-gray-800 text-sm truncate">{t.customer?.name}</span>
              <StatusBadge status={t.status} />
            </div>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">
              {t.transaction_number ?? t.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-xs font-semibold text-gray-700 mt-0.5">{formatAmount(t.total)}</p>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => onEdit(t)}
              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(t)}
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
