export type TransactionStatus = "draft" | "confirmed" | "cancelled";

export interface TransactionItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  transaction_number: string;
  customer_id: string;
  customer_name: string;
  items: TransactionItem[];
  discount: number;
  tax: number;
  total_amount: number;
  status: TransactionStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionPayload {
  customer_id: string;
  items: { product_id: string; quantity: number }[];
  discount?: number;
  tax?: number;
  notes?: string;
}

export interface UpdateTransactionPayload {
  discount?: number;
  tax?: number;
  notes?: string;
  items?: { product_id: string; quantity: number }[];
}

export interface UpdateTransactionStatusPayload {
  status: TransactionStatus;
}
