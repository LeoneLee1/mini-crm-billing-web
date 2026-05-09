"use client";

import { useState } from "react";
import { FileText, Search, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { cn } from "@/lib/utils";
import { deleteInvoice } from "@/services/invoices/invoiceService";
import { Invoice, InvoiceStatus } from "@/services/invoices/invoiceTypes";
import { Pagination } from "@/components/ui/pagination";
import { Toast } from "@/utils/sweet_alert_utils/Toast";
import { useListInvoices, InvoiceStatusFilter } from "@/hooks/invoices/useListInvoices";
import InvoiceTable from "./InvoiceTable";
import InvoiceModal from "./InvoiceModal";

const STATUS_FILTERS: { label: string; value: InvoiceStatusFilter }[] = [
  { label: "All",       value: "all" },
  { label: "Unpaid",    value: "unpaid" as InvoiceStatus },
  { label: "Paid",      value: "paid" as InvoiceStatus },
  { label: "Overdue",   value: "overdue" as InvoiceStatus },
  { label: "Cancelled", value: "cancelled" as InvoiceStatus },
];

export default function Invoices() {
  const {
    filteredInvoices,
    loading,
    setPage,
    meta,
    search,
    statusFilter,
    handleSearchChange,
    handleStatusFilter,
    refresh,
  } = useListInvoices();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  function openCreateModal() {
    setModalMode("create");
    setSelectedInvoice(null);
    setModalOpen(true);
  }

  function openEditModal(invoice: Invoice) {
    setModalMode("edit");
    setSelectedInvoice(invoice);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedInvoice(null);
  }

  async function handleDelete(invoice: Invoice) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Invoice?",
      text: `Invoice "${invoice.invoice_number}" will be deleted permanently.`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteInvoice(invoice.id);
      Toast.fire({ icon: "success", title: "Success!", text: "Invoice deleted successfully." });
      refresh();
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
            <FileText className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">Invoices</h1>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
              View and manage all invoices
            </p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 shrink-0"
          style={{ backgroundColor: "#1d3494" }}
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
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
              style={
                statusFilter === value
                  ? { backgroundColor: "#1d3494", borderColor: "#1d3494" }
                  : {}
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table + Pagination */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <InvoiceTable
          invoices={filteredInvoices}
          loading={loading}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
        <Pagination meta={meta} onPageChange={setPage} />
      </div>

      {/* Modal */}
      {modalOpen && (
        <InvoiceModal
          key={modalMode === "create" ? "create" : selectedInvoice?.id}
          mode={modalMode}
          invoice={selectedInvoice}
          onClose={closeModal}
          onSuccess={refresh}
        />
      )}
    </div>
  );
}
