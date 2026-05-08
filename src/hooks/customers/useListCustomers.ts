import { useEffect, useState } from "react";
import { getCustomers } from "@/services/customers/customerService";
import { Customer } from "@/services/customers/customerTypes";
import { PaginationMeta } from "@/components/ui/pagination";
import { Toast } from "@/utils/sweet_alert_utils/Toast";

export type StatusFilter = "all" | "active" | "inactive";

const LIMIT = 10;
const DEFAULT_META: PaginationMeta = { page: 1, totalPage: 1, total: 0, limit: LIMIT };

export function useListCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [fetchedFor, setFetchedFor] = useState<{ page: number; key: number } | null>(null);
  const loading = fetchedFor?.page !== page || fetchedFor?.key !== refreshKey;

  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    let active = true;

    getCustomers({ page, limit: LIMIT })
      .then((res) => {
        if (!active) return;
        const data = res?.data;
        const fetched: Customer[] = Array.isArray(data?.customers) ? data.customers : [];

        if (fetched.length === 0 && page > 1) {
          setPage((p) => p - 1);
          return;
        }

        setCustomers(fetched);
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
          "Failed to load customers.";
        Toast.fire({ icon: "error", title: "Failed", text: msg });
        setFetchedFor({ page, key: refreshKey });
      });

    return () => {
      active = false;
    };
  }, [refreshKey, page]);

  const filteredCustomers = customers.filter((c) => {
    const matchName = c.name.toLowerCase().includes(searchName.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchName && matchStatus;
  });

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchName(e.target.value);
    setPage(1);
  }

  function handleStatusFilter(value: StatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  return {
    filteredCustomers,
    loading,
    page,
    setPage,
    meta,
    searchName,
    statusFilter,
    handleSearchChange,
    handleStatusFilter,
    refresh: () => setRefreshKey((k) => k + 1),
  };
}
