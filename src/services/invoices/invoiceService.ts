import api from "@/lib/axios";
import { CreateInvoicePayload, UpdateInvoiceStatusPayload } from "./invoiceTypes";

export const getInvoices = (params?: { page?: number; limit?: number }) => api.get("/invoice", { params }).then((r) => r.data);

export const createInvoice = (payload: CreateInvoicePayload) => api.post("/invoice", payload).then((r) => r.data);

export const updatInvoice = (id: string, payload: UpdateInvoiceStatusPayload) => api.patch(`/invoice/${id}/status`, payload).then((r) => r.data);

export const deleteInvoice = (id: string) => api.delete(`/invoice/${id}`).then((r) => r.data);
