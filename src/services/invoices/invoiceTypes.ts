export type InvoiceStatus = "unpaid" | "paid" | "overdue" | "cancelled";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  customer_id: string;
  created_by: string;
  status: string;
  sub_total: number;
  discount: number;
  tax: number;
  total: number;
  notes: string;
  created_at: string;
  updated_at: string;
  customer: Customer;
}

export interface Invoice {
  id: string;
  transaction_id: string;
  invoice_number: string;
  due_date: string;
  status: InvoiceStatus;
  notes: string;
  created_at: string;
  updated_at: string;
  transaction: Transaction;
}

export interface CreateInvoicePayload {
  transaction_id: string;
  due_date: string;
  notes: string;
}

export interface UpdateInvoiceStatusPayload {
  status: string;
}
