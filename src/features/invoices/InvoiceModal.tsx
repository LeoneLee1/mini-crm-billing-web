"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectField } from "@/components/ui/select-field";
import { getTransactions } from "@/services/transactions/transactionService";
import { Transaction } from "@/services/transactions/transactionTypes";
import { createInvoice, updatInvoice } from "@/services/invoices/invoiceService";
import { Invoice, InvoiceStatus } from "@/services/invoices/invoiceTypes";
import { Toast } from "@/utils/sweet_alert_utils/Toast";

const STATUS_OPTIONS = [
  { label: "Unpaid",    value: "unpaid" },
  { label: "Paid",      value: "paid" },
  { label: "Overdue",   value: "overdue" },
  { label: "Cancelled", value: "cancelled" },
];

interface InvoiceModalProps {
  mode: "create" | "edit";
  invoice: Invoice | null;
  onClose: () => void;
  onSuccess: () => void;
}

function formatAmount(amount: number) {
  return `IDR ${Math.round(amount).toLocaleString("en-US")}`;
}

export default function InvoiceModal({ mode, invoice, onClose, onSuccess }: InvoiceModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingData, setLoadingData] = useState(mode === "create");

  const [transactionId, setTransactionId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState(invoice?.notes ?? "");
  const [status, setStatus] = useState<InvoiceStatus>(invoice?.status ?? "unpaid");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode !== "create") return;

    getTransactions({ page: 1, limit: 200, status: "confirmed" })
      .then((res) => {
        const list: Transaction[] = Array.isArray(res?.data?.transactions)
          ? res.data.transactions
          : [];
        setTransactions(list);
      })
      .catch(() => {
        Toast.fire({ icon: "error", title: "Failed", text: "Could not load transactions." });
      })
      .finally(() => setLoadingData(false));
  }, [mode]);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (mode === "create") {
      if (!transactionId) e.transactionId = "Transaction is required.";
      if (!dueDate) e.dueDate = "Due date is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.SyntheticEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      if (mode === "create") {
        await createInvoice({
          transaction_id: transactionId,
          due_date: new Date(dueDate).toISOString(),
          notes: notes.trim(),
        });
        Toast.fire({ icon: "success", title: "Success!", text: "Invoice created successfully." });
      } else if (invoice) {
        await updatInvoice(invoice.id, { status });
        Toast.fire({ icon: "success", title: "Success!", text: "Invoice status updated." });
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Something went wrong. Please try again.";
      Toast.fire({ icon: "error", title: "Failed", text: msg });
    } finally {
      setSubmitting(false);
    }
  }

  const inputBase = "w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors placeholder:text-gray-400";
  const inputOk   = "border-gray-200 focus:border-blue-500 bg-white";
  const inputErr  = "border-red-400 bg-red-50/30";

  const transactionOptions = transactions.map((t) => ({
    label: `${t.transaction_number} — ${t.customer_name}`,
    value: t.id,
  }));

  const selectedTransaction = transactions.find((t) => t.id === transactionId);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md z-10 max-h-[94svh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === "create" ? "New Invoice" : `Update Status — ${invoice?.invoice_number}`}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loadingData ? (
          <div className="flex items-center justify-center py-16">
            <div
              className="w-7 h-7 border-[3px] border-gray-200 rounded-full animate-spin"
              style={{ borderTopColor: "#1d3494" }}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 sm:py-5 space-y-5 overflow-y-auto">

            {mode === "create" && (
              <>
                {/* Transaction */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Transaction <span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    value={transactionId}
                    onChange={(val) => {
                      setTransactionId(val);
                      setErrors((p) => { const n = { ...p }; delete n.transactionId; return n; });
                    }}
                    options={transactionOptions}
                    placeholder="Select confirmed transaction..."
                    error={!!errors.transactionId}
                  />
                  {errors.transactionId && (
                    <p className="text-xs text-red-500">{errors.transactionId}</p>
                  )}
                  {transactions.length === 0 && (
                    <p className="text-xs text-gray-400">No confirmed transactions available.</p>
                  )}
                </div>

                {/* Transaction summary preview */}
                {selectedTransaction && (
                  <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1.5 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Customer</span>
                      <span className="font-medium text-gray-700">{selectedTransaction.customer_name}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Items</span>
                      <span className="font-medium text-gray-700">{selectedTransaction.items?.length ?? 0} item(s)</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 pt-1.5 border-t border-gray-200">
                      <span>Total</span>
                      <span>{formatAmount(selectedTransaction.total_amount)}</span>
                    </div>
                  </div>
                )}

                {/* Due Date */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      setErrors((p) => { const n = { ...p }; delete n.dueDate; return n; });
                    }}
                    className={cn(inputBase, errors.dueDate ? inputErr : inputOk, "cursor-pointer")}
                  />
                  {errors.dueDate && (
                    <p className="text-xs text-red-500">{errors.dueDate}</p>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Notes{" "}
                    <span className="text-gray-400 font-normal text-xs">(optional)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes..."
                    rows={3}
                    className={cn(inputBase, "resize-none", inputOk)}
                  />
                </div>
              </>
            )}

            {mode === "edit" && (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <SelectField
                  value={status}
                  onChange={(val) => setStatus(val as InvoiceStatus)}
                  options={STATUS_OPTIONS}
                />
                <p className="text-xs text-gray-400">
                  Current status:{" "}
                  <span className="font-medium capitalize text-gray-600">{invoice?.status}</span>
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#1d3494" }}
              >
                {submitting
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Invoice"
                  : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
