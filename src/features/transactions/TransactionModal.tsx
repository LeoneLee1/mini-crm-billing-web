"use client";

import { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { cn } from "@/lib/utils";
import { getCustomers } from "@/services/customers/customerService";
import { Customer } from "@/services/customers/customerTypes";
import { getProducts } from "@/services/products/productService";
import { Product } from "@/services/products/productTypes";
import {
  createTransaction,
  updateTransaction,
  updateTransactionStatus,
} from "@/services/transactions/transactionService";
import { Transaction, TransactionStatus } from "@/services/transactions/transactionTypes";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

interface ItemRow {
  product_id: string;
  quantity: string;
  unit_price: number;
}

interface TransactionModalProps {
  mode: "create" | "edit";
  transaction: Transaction | null;
  onClose: () => void;
  onSuccess: () => void;
}

const STATUS_OPTIONS: { label: string; value: TransactionStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
];

const EMPTY_ITEM: ItemRow = { product_id: "", quantity: "1", unit_price: 0 };

export default function TransactionModal({ mode, transaction, onClose, onSuccess }: TransactionModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [customerId, setCustomerId] = useState(transaction?.customer_id ?? "");
  const [items, setItems] = useState<ItemRow[]>(
    transaction?.items?.length
      ? transaction.items.map((i) => ({ product_id: i.product_id, quantity: String(i.quantity), unit_price: i.unit_price }))
      : [{ ...EMPTY_ITEM }]
  );
  const [discount, setDiscount] = useState(String(transaction?.discount ?? "0"));
  const [tax, setTax] = useState(String(transaction?.tax ?? "0"));
  const [notes, setNotes] = useState(transaction?.notes ?? "");
  const [status, setStatus] = useState<TransactionStatus>(transaction?.status ?? "draft");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      getCustomers({ page: 1, limit: 200 }),
      getProducts({ page: 1, limit: 200 }),
    ])
      .then(([custRes, prodRes]) => {
        setCustomers(Array.isArray(custRes?.data?.customers) ? custRes.data.customers : []);
        setProducts(Array.isArray(prodRes?.data?.products) ? prodRes.data.products : []);
      })
      .catch(() => {
        Toast.fire({ icon: "error", title: "Failed", text: "Could not load customers or products." });
      })
      .finally(() => setLoadingData(false));
  }, []);

  const itemsSubtotal = items.reduce((sum, i) => {
    const qty = parseFloat(i.quantity) || 0;
    return sum + qty * i.unit_price;
  }, 0);
  const discountNum = parseFloat(discount) || 0;
  const taxNum = parseFloat(tax) || 0;
  const grandTotal = itemsSubtotal - discountNum + taxNum;

  function handleItemChange(index: number, field: keyof ItemRow, value: string) {
    setItems((prev) => {
      const next = [...prev];
      if (field === "product_id") {
        const prod = products.find((p) => p.id === value);
        next[index] = { ...next[index], product_id: value, unit_price: prod?.price ?? 0 };
      } else {
        next[index] = { ...next[index], [field]: value };
      }
      return next;
    });
    setErrors((prev) => { const e = { ...prev }; delete e[`item_${index}`]; return e; });
  }

  function addItem() {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!customerId) e.customer = "Customer is required.";
    if (items.length === 0) e.items = "At least one item is required.";
    items.forEach((item, i) => {
      if (!item.product_id) e[`item_${i}`] = "Select a product.";
      else if (!item.quantity || parseFloat(item.quantity) <= 0) e[`item_${i}`] = "Quantity must be > 0.";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const itemPayload = items.map((i) => ({
        product_id: i.product_id,
        quantity: parseFloat(i.quantity),
      }));

      if (mode === "create") {
        await createTransaction({
          customer_id: customerId,
          items: itemPayload,
          discount: discountNum || undefined,
          tax: taxNum || undefined,
          notes: notes.trim() || undefined,
        });
        Toast.fire({ icon: "success", title: "Success!", text: "Transaction created successfully." });
      } else if (transaction) {
        await updateTransaction(transaction.id, {
          items: itemPayload,
          discount: discountNum,
          tax: taxNum,
          notes: notes.trim() || undefined,
        });
        if (status !== transaction.status) {
          await updateTransactionStatus(transaction.id, { status });
        }
        Toast.fire({ icon: "success", title: "Success!", text: "Transaction updated successfully." });
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

  const inputBase = "w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors placeholder:text-gray-400 bg-white";
  const inputOk = "border-gray-200 focus:border-blue-500";
  const inputErr = "border-red-400 bg-red-50/30";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-2xl z-10 max-h-[94svh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === "create" ? "New Transaction" : `Edit — ${transaction?.transaction_number}`}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loadingData ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-3 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: "#1d3494" }} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 space-y-5 overflow-y-auto">

            {/* Customer + Status row */}
            <div className={cn("grid gap-4", mode === "edit" ? "sm:grid-cols-2" : "grid-cols-1")}>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Customer <span className="text-red-500">*</span>
                </label>
                <select
                  value={customerId}
                  onChange={(e) => { setCustomerId(e.target.value); setErrors((p) => { const n = { ...p }; delete n.customer; return n; }); }}
                  disabled={mode === "edit"}
                  className={cn(inputBase, errors.customer ? inputErr : inputOk, "cursor-pointer disabled:bg-gray-50 disabled:text-gray-500")}
                >
                  <option value="">Select customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.customer && <p className="text-xs text-red-500">{errors.customer}</p>}
              </div>

              {mode === "edit" && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                    className={cn(inputBase, inputOk, "cursor-pointer")}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Items <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors"
                  style={{ color: "#1d3494", borderColor: "#1d3494" }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Item
                </button>
              </div>
              {errors.items && <p className="text-xs text-red-500">{errors.items}</p>}

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-130">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase w-28">Qty</th>
                        <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase w-32">Unit Price</th>
                        <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase w-32">Subtotal</th>
                        <th className="px-3 py-2.5 w-10" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {items.map((item, idx) => {
                        const qty = parseFloat(item.quantity) || 0;
                        const subtotal = qty * item.unit_price;
                        return (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="px-3 py-2">
                              <select
                                value={item.product_id}
                                onChange={(e) => handleItemChange(idx, "product_id", e.target.value)}
                                className={cn("w-full px-2.5 py-1.5 rounded-lg border text-sm outline-none focus:border-blue-500 bg-white cursor-pointer", errors[`item_${idx}`] ? "border-red-400 bg-red-50/30" : "border-gray-200")}
                              >
                                <option value="">Select product...</option>
                                {products.map((p) => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                              </select>
                              {errors[`item_${idx}`] && <p className="text-xs text-red-500 mt-0.5">{errors[`item_${idx}`]}</p>}
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number" min="0.01" step="0.01"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 bg-white"
                              />
                            </td>
                            <td className="px-3 py-2 text-right text-gray-600 whitespace-nowrap">
                              {item.unit_price ? `IDR ${item.unit_price.toLocaleString("en-US")}` : "—"}
                            </td>
                            <td className="px-3 py-2 text-right font-medium text-gray-800 whitespace-nowrap">
                              {subtotal > 0 ? `IDR ${Math.round(subtotal).toLocaleString("en-US")}` : "—"}
                            </td>
                            <td className="px-3 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => removeItem(idx)}
                                disabled={items.length === 1}
                                className="p-1 rounded-lg text-red-400 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Discount + Tax */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Discount <span className="text-gray-400 font-normal text-xs">(optional)</span>
                </label>
                <input
                  type="number" min="0" step="0.01" value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0"
                  className={cn(inputBase, inputOk)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Tax <span className="text-gray-400 font-normal text-xs">(optional)</span>
                </label>
                <input
                  type="number" min="0" step="0.01" value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  placeholder="0"
                  className={cn(inputBase, inputOk)}
                />
              </div>
            </div>

            {/* Total summary */}
            <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>IDR {Math.round(itemsSubtotal).toLocaleString("en-US")}</span>
              </div>
              {discountNum > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- IDR {Math.round(discountNum).toLocaleString("en-US")}</span>
                </div>
              )}
              {taxNum > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Tax</span>
                  <span>+ IDR {Math.round(taxNum).toLocaleString("en-US")}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 pt-1.5 border-t border-gray-200">
                <span>Total</span>
                <span>IDR {Math.round(grandTotal).toLocaleString("en-US")}</span>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Notes <span className="text-gray-400 font-normal text-xs">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes..."
                rows={2}
                className={cn(inputBase, "resize-none", inputOk)}
              />
            </div>

            {/* Footer */}
            <div className="flex gap-3 pt-1 pb-1">
              <button
                type="button" onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit" disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#1d3494" }}
              >
                {submitting ? "Saving..." : mode === "create" ? "Create Transaction" : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
