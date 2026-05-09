import { useEffect, useState } from "react";
import { getCustomers } from "@/services/customers/customerService";
import { getTransactions } from "@/services/transactions/transactionService";
import { getInvoices } from "@/services/invoices/invoiceService";
import { getProducts } from "@/services/products/productService";
import type { Invoice } from "@/services/invoices/invoiceTypes";
import type { Transaction } from "@/services/transactions/transactionTypes";

export interface DashboardData {
  totalCustomers: number;
  totalTransactions: number;
  totalInvoices: number;
  totalProducts: number;
  invoiceByStatus: { paid: number; unpaid: number; overdue: number; cancelled: number };
  recentTransactions: Transaction[];
  recentInvoices: Invoice[];
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      getCustomers({ page: 1, limit: 5 }),
      getTransactions({ page: 1, limit: 5 }),
      getInvoices({ page: 1, limit: 1 }),
      getProducts({ page: 1, limit: 5 }),
    ])
      .then(async ([custRes, txRes, invFirstRes, prodRes]) => {
        if (!active) return;

        const totalInvoices: number = invFirstRes?.data?.total ?? 0;

        const invAllRes = totalInvoices > 0
          ? await getInvoices({ page: 1, limit: totalInvoices })
          : invFirstRes;

        if (!active) return;

        const invoices: Invoice[] = invAllRes?.data?.invoices ?? [];

        setData({
          totalCustomers: custRes?.data?.total ?? 0,
          totalTransactions: txRes?.data?.total ?? 0,
          totalInvoices,
          totalProducts: prodRes?.data?.total ?? 0,
          invoiceByStatus: {
            paid:      invoices.filter((i) => i.status === "paid").length,
            unpaid:    invoices.filter((i) => i.status === "unpaid").length,
            overdue:   invoices.filter((i) => i.status === "overdue").length,
            cancelled: invoices.filter((i) => i.status === "cancelled").length,
          },
          recentTransactions: (txRes?.data?.transaction ?? []).slice(0, 5),
          recentInvoices: invoices.slice(0, 5),
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
}
