import api from "@/lib/axios";
import {
  CreateTransactionPayload,
  UpdateTransactionPayload,
  UpdateTransactionStatusPayload,
} from "./transactionTypes";

export const getTransactions = (params?: { page?: number; limit?: number; status?: string }) =>
  api.get("/transactions", { params }).then((r) => r.data);

export const getTransactionById = (id: string) =>
  api.get(`/transactions/${id}`).then((r) => r.data);

export const createTransaction = (payload: CreateTransactionPayload) =>
  api.post("/transactions", payload).then((r) => r.data);

export const updateTransaction = (id: string, payload: UpdateTransactionPayload) =>
  api.put(`/transactions/${id}`, payload).then((r) => r.data);

export const updateTransactionStatus = (id: string, payload: UpdateTransactionStatusPayload) =>
  api.patch(`/transactions/${id}/status`, payload).then((r) => r.data);

export const deleteTransaction = (id: string) =>
  api.delete(`/transactions/${id}`).then((r) => r.data);
