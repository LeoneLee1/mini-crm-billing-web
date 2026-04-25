import api from "@/lib/axios";
import { CreateProductPayload, UpdateProductPayload } from "./productTypes";

export const getProducts = (params?: { page?: number; limit?: number }) =>
  api.get("/products", { params }).then((r) => r.data);

export const getProductById = (id: string) =>
  api.get(`/products/${id}`).then((r) => r.data);

export const createProduct = (payload: CreateProductPayload) =>
  api.post("/products", payload).then((r) => r.data);

export const updateProduct = (id: string, payload: UpdateProductPayload) =>
  api.put(`/products/${id}`, payload).then((r) => r.data);

export const deleteProduct = (id: string) =>
  api.delete(`/products/${id}`).then((r) => r.data);
