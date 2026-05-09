"use client";

import { Users, ShoppingCart, Package, FileText, Clock, CheckCircle, AlertCircle, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/hooks/dashboard/useDashboard";
import { formatDate, formatCurrency } from "@/utils/formatters";
import type { Invoice } from "@/services/invoices/invoiceTypes";
import type { Transaction } from "@/services/transactions/transactionTypes";

function StatCard({ icon, label, value, iconBg }: { icon: React.ReactNode; label: string; value: number; iconBg: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}

const TX_STATUS: Record<string, { label: string; cls: string }> = {
  confirmed: { label: "Confirmed", cls: "bg-green-100 text-green-700" },
  draft: { label: "Draft", cls: "bg-gray-100 text-gray-600" },
  cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-600" },
};

const INV_STATUS: Record<string, { label: string; cls: string }> = {
  paid: { label: "Paid", cls: "bg-green-100 text-green-700" },
  unpaid: { label: "Unpaid", cls: "bg-amber-100 text-amber-700" },
  overdue: { label: "Overdue", cls: "bg-red-100 text-red-600" },
  cancelled: { label: "Cancelled", cls: "bg-gray-100 text-gray-600" },
};

function Badge({ status, map }: { status: string; map: Record<string, { label: string; cls: string }> }) {
  const s = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-600" };
  return <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", s.cls)}>{s.label}</span>;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-10 w-48 bg-gray-100 rounded-lg" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 h-72 bg-gray-100 rounded-2xl" />
        <div className="h-72 bg-gray-100 rounded-2xl" />
      </div>
      <div className="h-64 bg-gray-100 rounded-2xl" />
    </div>
  );
}

export default function Dashboard() {
  const { data, loading } = useDashboard();

  if (loading) return <LoadingSkeleton />;
  if (!data) return null;

  const { totalCustomers, totalTransactions, totalProducts, totalInvoices, invoiceByStatus, recentTransactions, recentInvoices } = data;

  const invStatusItems = [
    { key: "paid",      label: "Paid",      count: invoiceByStatus.paid,      icon: <CheckCircle  className="w-4 h-4" />, cls: "text-green-600 bg-green-50"  },
    { key: "unpaid",    label: "Unpaid",    count: invoiceByStatus.unpaid,    icon: <Clock        className="w-4 h-4" />, cls: "text-amber-600 bg-amber-50"  },
    { key: "overdue",   label: "Overdue",   count: invoiceByStatus.overdue,   icon: <AlertCircle  className="w-4 h-4" />, cls: "text-red-600 bg-red-50"      },
    { key: "cancelled", label: "Cancelled", count: invoiceByStatus.cancelled, icon: <Ban          className="w-4 h-4" />, cls: "text-gray-500 bg-gray-100"   },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users     className="w-5 h-5 text-blue-600"   />} label="Customers"    value={totalCustomers}    iconBg="bg-blue-50"   />
        <StatCard icon={<ShoppingCart className="w-5 h-5 text-indigo-600" />} label="Transactions" value={totalTransactions} iconBg="bg-indigo-50" />
        <StatCard icon={<Package   className="w-5 h-5 text-teal-600"   />} label="Products"     value={totalProducts}     iconBg="bg-teal-50"   />
        <StatCard icon={<FileText  className="w-5 h-5 text-violet-600" />} label="Invoices"     value={totalInvoices}     iconBg="bg-violet-50" />
      </div>

      {/* Recent Transactions + Invoice Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 text-sm">Recent Transactions</h2>
          </div>
          {recentTransactions.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-12">No transactions yet</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentTransactions.map((tx: Transaction) => (
                <div key={tx.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{tx.customer?.name ?? "—"}</p>
                    <p className="text-xs text-gray-400">{tx.transaction_number ?? tx.id.slice(0, 8)}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-gray-700">{formatCurrency(tx.total)}</span>
                    <Badge status={tx.status} map={TX_STATUS} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invoice Status Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Invoice Status</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              From latest {totalInvoices > 50 ? "50" : totalInvoices} invoices
            </p>
          </div>
          <div className="p-4 space-y-2.5">
            {invStatusItems.map((item) => (
              <div key={item.key} className={cn("flex items-center justify-between px-4 py-3 rounded-xl", item.cls)}>
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-lg font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800 text-sm">Recent Invoices</h2>
        </div>
        {recentInvoices.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-12">No invoices yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-50">
                  <th className="px-5 py-3 text-left font-medium">Invoice #</th>
                  <th className="px-5 py-3 text-left font-medium">Customer</th>
                  <th className="px-5 py-3 text-left font-medium">Due Date</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3 text-center font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentInvoices.map((inv: Invoice) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-800">{inv.invoice_number}</td>
                    <td className="px-5 py-3.5 text-gray-600">{inv.transaction?.customer?.name ?? "—"}</td>
                    <td className="px-5 py-3.5 text-gray-500">{formatDate(inv.due_date)}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-800">
                      {formatCurrency(inv.transaction?.total ?? 0)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Badge status={inv.status} map={INV_STATUS} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
