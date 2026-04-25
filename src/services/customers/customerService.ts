import api from "@/lib/axios";
import { CreateCustomerPayload, UpdateCustomerPayload } from "./customerTypes";

export const getCustomers = (params?: { page?: number; limit?: number }) =>
  api.get("/customers", { params }).then((r) => r.data);

export const getCustomerById = (id: string) =>
  api.get(`/customers/${id}`).then((r) => r.data);

export const createCustomer = (payload: CreateCustomerPayload) =>
  api.post("/customers", payload).then((r) => r.data);

export const updateCustomer = (id: string, payload: UpdateCustomerPayload) =>
  api.put(`/customers/${id}`, payload).then((r) => r.data);

export const deleteCustomer = (id: string) =>
  api.delete(`/customers/${id}`).then((r) => r.data);
