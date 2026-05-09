import { useEffect, useState } from "react";
import { getInvoices } from "@/services/invoices/invoiceService";
import { Invoice, InvoiceStatus } from "@/services/invoices/invoiceTypes";
import { PaginationMeta } from "@/components/ui/pagination";
import { Toast } from "@/utils/sweet_alert_utils/Toast";

export type InvoiceStatusFilter = "all" | InvoiceStatus;

const LIMIT = 10;
const DEFAULT_META: PaginationMeta = { page: 1, totalPage: 1, total: 0, limit: LIMIT };

export function useListInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [fetchedFor, setFetchedFor] = useState<{ page: number; key: number } | null>(null);
  const loading = fetchedFor?.page !== page || fetchedFor?.key !== refreshKey;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>("all");

  useEffect(() => {
    let active = true;

    getInvoices({ page, limit: LIMIT })
      .then((res) => {
        if (!active) return;
        const data = res?.data;
        const fetched: Invoice[] = Array.isArray(data?.invoices) ? data.invoices : [];

        if (fetched.length === 0 && page > 1) {
          setPage((p) => p - 1);
          return;
        }

        setInvoices(fetched);
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
          "Failed to load invoices.";
        Toast.fire({ icon: "error", title: "Failed", text: msg });
        setFetchedFor({ page, key: refreshKey });
      });

    return () => {
      active = false;
    };
  }, [refreshKey, page]);

  const filteredInvoices = invoices.filter((inv) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      inv.invoice_number.toLowerCase().includes(q) ||
      inv.transaction.customer.name.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleStatusFilter(value: InvoiceStatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  return {
    filteredInvoices,
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
