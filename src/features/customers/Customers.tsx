"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Building2 } from "lucide-react";
import Swal from "sweetalert2";
import { cn } from "@/lib/utils";
import { getCustomers, deleteCustomer } from "@/services/customers/customerService";
import { Customer } from "@/services/customers/customerTypes";
import { Pagination, PaginationMeta } from "@/components/ui/pagination";
import CustomerTable from "./CustomerTable";
import CustomerModal from "./CustomerModal";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

type StatusFilter = "all" | "active" | "inactive";

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const LIMIT = 10;
const DEFAULT_META: PaginationMeta = { page: 1, totalPage: 1, total: 0, limit: LIMIT };

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);

  const [fetchedFor, setFetchedFor] = useState<{ page: number; key: number } | null>(null);
  const loading = fetchedFor?.page !== page || fetchedFor?.key !== refreshKey;

  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

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
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to load customers.";
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

  function openCreateModal() {
    setModalMode("create");
    setSelectedCustomer(null);
    setModalOpen(true);
  }

  function openEditModal(customer: Customer) {
    setModalMode("edit");
    setSelectedCustomer(customer);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedCustomer(null);
  }

  async function handleDelete(customer: Customer) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Customer?",
      text: `Customer "${customer.name}" will be deleted permanently.`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteCustomer(customer.id);
      Toast.fire({ icon: "success", title: "Success!", text: "Customer successfully deleted." });
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Something went wrong. Try again.";
      Toast.fire({ icon: "error", title: "Failed", text: msg });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#1d3494" }}>
            <Building2 className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">Customers Management</h1>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Manage customer data</p>
          </div>
        </div>
        <button onClick={openCreateModal} className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 shrink-0" style={{ backgroundColor: "#1d3494" }}>
          <Plus className="w-4 h-4" />
          <span>Create new</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name..."
            value={searchName}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 bg-white transition-colors placeholder:text-gray-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleStatusFilter(value)}
              className={cn("px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all border", statusFilter === value ? "text-white border-transparent" : "text-gray-600 border-gray-200 bg-white hover:bg-gray-50")}
              style={statusFilter === value ? { backgroundColor: "#1d3494", borderColor: "#1d3494" } : {}}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table + Pagination */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <CustomerTable customers={filteredCustomers} loading={loading} onEdit={openEditModal} onDelete={handleDelete} />
        <Pagination meta={meta} onPageChange={setPage} />
      </div>

      {/* Modal */}
      {modalOpen && <CustomerModal key={modalMode === "create" ? "create" : selectedCustomer?.id} mode={modalMode} customer={selectedCustomer} onClose={closeModal} onSuccess={() => setRefreshKey((k) => k + 1)} />}
    </div>
  );
}
