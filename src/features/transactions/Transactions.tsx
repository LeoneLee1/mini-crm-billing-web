"use client";

import { useEffect, useState } from "react";
import { Search, Receipt, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { cn } from "@/lib/utils";
import { getTransactions, deleteTransaction } from "@/services/transactions/transactionService";
import { Transaction, TransactionStatus } from "@/services/transactions/transactionTypes";
import { Pagination, PaginationMeta } from "@/components/ui/pagination";
import TransactionTable from "./TransactionTable";
import TransactionModal from "./TransactionModal";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

type StatusFilter = "all" | TransactionStatus;

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
];

const LIMIT = 10;
const DEFAULT_META: PaginationMeta = { page: 1, totalPage: 1, total: 0, limit: LIMIT };

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);

  const [fetchedFor, setFetchedFor] = useState<{ page: number; key: number } | null>(null);
  const loading = fetchedFor?.page !== page || fetchedFor?.key !== refreshKey;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    let active = true;

    const params = {
      page,
      limit: LIMIT,
      ...(statusFilter !== "all" && { status: statusFilter }),
    };

    getTransactions(params)
      .then((res) => {
        if (!active) return;
        const data = res?.data;
        const fetched: Transaction[] = Array.isArray(data?.transactions) ? data.transactions : [];

        if (fetched.length === 0 && page > 1) {
          setPage((p) => p - 1);
          return;
        }

        setTransactions(fetched);
        setMeta({
          page: data?.page ?? 1,
          totalPage: data?.total_page ?? 1,
          total: data?.total ?? 0,
          limit: data?.limit ?? LIMIT,
        });
        setFetchedFor({ page, key: refreshKey });
      })
      .catch((err: unknown) => {
        if (!active) return;
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Failed to load transactions.";
        Toast.fire({ icon: "error", title: "Failed", text: msg });
        setFetchedFor({ page, key: refreshKey });
      });

    return () => { active = false; };
  }, [refreshKey, page, statusFilter]);

  const filteredTransactions = transactions.filter((t) => {
    const q = search.toLowerCase();
    return (
      !q ||
      t.transaction_number.toLowerCase().includes(q) ||
      t.customer_name.toLowerCase().includes(q)
    );
  });

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleStatusFilter(value: StatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  function openCreateModal() {
    setModalMode("create");
    setSelectedTransaction(null);
    setModalOpen(true);
  }

  function openEditModal(transaction: Transaction) {
    setModalMode("edit");
    setSelectedTransaction(transaction);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedTransaction(null);
  }

  async function handleDelete(transaction: Transaction) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Transaction?",
      text: `Invoice "${transaction.transaction_number}" will be deleted permanently.`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteTransaction(transaction.id);
      Toast.fire({ icon: "success", title: "Success!", text: "Transaction deleted successfully." });
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Something went wrong. Please try again.";
      Toast.fire({ icon: "error", title: "Failed", text: msg });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#1d3494" }}
          >
            <Receipt className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">Transaction History</h1>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">View and manage all transactions</p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 shrink-0"
          style={{ backgroundColor: "#1d3494" }}
        >
          <Plus className="w-4 h-4" />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoice or customer..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 bg-white transition-colors placeholder:text-gray-400"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleStatusFilter(value)}
              className={cn(
                "px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all border",
                statusFilter === value
                  ? "text-white border-transparent"
                  : "text-gray-600 border-gray-200 bg-white hover:bg-gray-50"
              )}
              style={statusFilter === value ? { backgroundColor: "#1d3494", borderColor: "#1d3494" } : {}}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table + Pagination */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <TransactionTable
          transactions={filteredTransactions}
          loading={loading}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
        <Pagination meta={meta} onPageChange={setPage} />
      </div>

      {/* Modal */}
      {modalOpen && (
        <TransactionModal
          key={modalMode === "create" ? "create" : selectedTransaction?.id}
          mode={modalMode}
          transaction={selectedTransaction}
          onClose={closeModal}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
