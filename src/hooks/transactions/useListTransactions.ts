import { useEffect, useState } from "react";
import { getTransactions } from "@/services/transactions/transactionService";
import { Transaction, TransactionStatus } from "@/services/transactions/transactionTypes";
import { PaginationMeta } from "@/components/ui/pagination";
import { Toast } from "@/utils/sweet_alert_utils/Toast";

export type TransactionStatusFilter = "all" | TransactionStatus;

const LIMIT = 10;
const DEFAULT_META: PaginationMeta = { page: 1, totalPage: 1, total: 0, limit: LIMIT };

type FetchedFor = { page: number; key: number; status: TransactionStatusFilter };

export function useListTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [fetchedFor, setFetchedFor] = useState<FetchedFor | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatusFilter>("all");

  const loading = fetchedFor?.page !== page || fetchedFor?.key !== refreshKey || fetchedFor?.status !== statusFilter;

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

        const fetched: Transaction[] = Array.isArray(data?.transaction) ? data.transaction : [];

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
        setFetchedFor({ page, key: refreshKey, status: statusFilter });
      })
      .catch((err: unknown) => {
        if (!active) return;
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to load transactions.";
        Toast.fire({ icon: "error", title: "Failed", text: msg });
        setFetchedFor({ page, key: refreshKey, status: statusFilter });
      });

    return () => {
      active = false;
    };
  }, [refreshKey, page, statusFilter]);

  const filteredTransactions = transactions.filter((t) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (t.transaction_number ?? "").toLowerCase().includes(q) ||
      (t.customer?.name ?? "").toLowerCase().includes(q)
    );
  });

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleStatusFilter(value: TransactionStatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  return {
    filteredTransactions,
    loading,
    page,
    setPage,
    meta,
    search,
    statusFilter,
    handleSearchChange,
    handleStatusFilter,
    refresh: () => setRefreshKey((k) => k + 1),
  };
}
